import { Injectable, OnDestroy } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { selectRoutedPageEpisodes, selectRouter,
  selectAggregateSelectedEpisodeGuids, selectSelectedEpisodeDropdays,
  selectUserAuthorized } from '@app/ngrx/reducers/selectors/';
import {
  RouterParams,
  PartialRouterParams,
  Episode,
  CHARTTYPE_PODCAST,
  CHARTTYPE_EPISODES,
  CHARTTYPE_LINE,
  CHARTTYPE_HORIZBAR,
  CHARTTYPE_GEOCHART,
  INTERVAL_DAILY,
  INTERVAL_HOURLY,
  METRICSTYPE_DEMOGRAPHICS,
  METRICSTYPE_DOWNLOADS,
  METRICSTYPE_TRAFFICSOURCES,
  GROUPTYPE_GEOCOUNTRY,
  GROUPTYPE_GEOMETRO,
  GROUPTYPE_GEOSUBDIV,
  GROUPTYPE_AGENTOS,
  GROUPTYPE_AGENTNAME,
  GROUPTYPE_AGENTTYPE,
  EPISODE_PAGE_SIZE,
  EPISODE_SELECT_PAGE_SIZE,
  METRICSTYPE_DROPDAY,
  EpisodeDropday
} from '@app/ngrx/';
import * as localStorageUtil from '@app/shared/util/local-storage.util';
import * as dateUtil from '@app/shared/util/date/';
import * as ACTIONS from '@app/ngrx/actions/';

@Injectable()
export class RoutingService implements OnDestroy {
  routerParams: RouterParams;
  episodes: Episode[];
  aggregateSelectedEpisodeGuids: string[];
  dropdayEpisodes: EpisodeDropday[];
  destroyed$: Subject<void> = new Subject();

  constructor (public store: Store<any>,
               private router: Router) {
    // don't start watching anything until user is authorized
    let subscribed = false;
    this.store.pipe(
      select(selectUserAuthorized),
      takeUntil(this.destroyed$)
    ).subscribe(authorized => {
      if (!subscribed && authorized) {
        this.dontAllowRoot();
        this.subRoutedPageEpisodes();
        this.subSelectedEpisodes();
        this.subRouterParams();
        subscribed = true;
      }
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
   }

  dontAllowRoot() {
    // for redirecting users routed to '/'
    this.router.events.pipe(
      filter(event => event instanceof RoutesRecognized),
      takeUntil(this.destroyed$)
    ).subscribe((event: RoutesRecognized) => {
      if (event.url === '/' && this.routerParams && this.routerParams.podcastId) {
        this.normalizeAndRoute(this.routerParams);
      }
    });
  }

  subRoutedPageEpisodes() {
    this.store.pipe(
      select(selectRoutedPageEpisodes),
      takeUntil(this.destroyed$)
    ).subscribe((episodes: Episode[]) => {
      this.episodes = episodes;
    });
  }

  subSelectedEpisodes() {
    this.store.pipe(
      select(selectAggregateSelectedEpisodeGuids),
      takeUntil(this.destroyed$)
    ).subscribe((guids: string[]) => {
      this.aggregateSelectedEpisodeGuids = guids;
    });
    this.store.pipe(
      select(selectSelectedEpisodeDropdays),
      takeUntil(this.destroyed$)
    ).subscribe((episodes: EpisodeDropday[]) => {
      this.dropdayEpisodes = episodes;
    });
  }

  subRouterParams() {
    this.store.pipe(
      select(selectRouter),
      takeUntil(this.destroyed$)
    ).subscribe(routerParams => {
      // don't do anything with setting route or loading metrics until podcast is set
      if (routerParams.podcastId) {
        // if this.routerParams has not yet been set, go through routing which checks for and sets defaults
        if (!this.routerParams) {
          routerParams = this.normalizeAndRoute(routerParams);
        }
        this.checkChangesToParamsAndLoadData(routerParams);
        this.routerParams = routerParams;
      }
    });
  }

  checkChangesToParamsAndLoadData(newRouterParams: RouterParams) {
    if (this.isPodcastChanged(newRouterParams)) {
      this.loadSelectEpisodes(newRouterParams);
    }
    switch (newRouterParams.metricsType) {
      case METRICSTYPE_DOWNLOADS:
        if (this.isPodcastChanged(newRouterParams) ||
          this.isEpisodePageChanged(newRouterParams) || this.isMetricsTypeChanged(newRouterParams)) {
          this.loadEpisodes(newRouterParams);
        } else if (this.isBeginDateChanged(newRouterParams) ||
          this.isEndDateChanged(newRouterParams) || this.isIntervalChanged(newRouterParams)) {
          // if episode page or podcast didn't change, check if other router params changed and load metrics
          // otherwise episode page loading will trigger loading of metrics (in order to load metrics for each loaded episode on that page)
          this.loadDownloads(newRouterParams);
        }
        break;
      case METRICSTYPE_DROPDAY:
        if (this.isPodcastChanged(newRouterParams) || this.isMetricsTypeChanged(newRouterParams)) {
          if ((!this.dropdayEpisodes || !this.dropdayEpisodes.length)) {
            // just landed on dropdays but there no selected episodes
            // want to show the first page of episodes, but we likely don't have that...
            // so load the first page of episodes
            //  + an effect to loadRoutedDropdays when page 1 of episodes loads on dropdays and also select that page of episodes
            this.loadEpisodes({podcastId: newRouterParams.podcastId, episodePage: 1});
          } else {
            this.loadDropdayEpisodeAllTimeDownloads();
            this.loadSelectedEpisodeDropdays(newRouterParams);
          }
        } else if (this.dropdayEpisodes && this.dropdayEpisodes.length &&
                  (this.isDropdaysChanged(newRouterParams) || this.isIntervalChanged(newRouterParams))) {
            // were already in dropdays w/ selected episodes but days or interval params changed
          this.loadSelectedEpisodeDropdays(newRouterParams);
        }
        break;
      case METRICSTYPE_DEMOGRAPHICS:
        if (this.aggregateSelectedEpisodeGuids && this.aggregateSelectedEpisodeGuids.length > 0) {
          if (this.isMetricsTypeChanged(newRouterParams) || this.isGroupChanged(newRouterParams) ||
              this.isBeginDateChanged(newRouterParams) || this.isEndDateChanged(newRouterParams)) {
            this.loadEpisodeTotals(newRouterParams);
          }
          if (this.isMetricsTypeChanged(newRouterParams) || this.isGroupChanged(newRouterParams) ||
              this.isBeginDateChanged(newRouterParams) || this.isEndDateChanged(newRouterParams) ||
              this.isIntervalChanged(newRouterParams)) {
            this.loadEpisodeRanks(newRouterParams);
          }
          if (newRouterParams.group === GROUPTYPE_GEOCOUNTRY && newRouterParams.filter &&
            (this.isFilterChanged(newRouterParams) || this.isPodcastChanged(newRouterParams) ||
              this.isBeginDateChanged(newRouterParams) || this.isEndDateChanged(newRouterParams))) {
            this.loadEpisodeTotals({...newRouterParams, group: GROUPTYPE_GEOSUBDIV, filter: newRouterParams.filter});
          }
          if (newRouterParams.group === GROUPTYPE_GEOCOUNTRY && newRouterParams.filter &&
            (this.isFilterChanged(newRouterParams) || this.isPodcastChanged(newRouterParams) ||
              this.isBeginDateChanged(newRouterParams) || this.isEndDateChanged(newRouterParams) ||
              this.isIntervalChanged(newRouterParams))) {
            this.loadEpisodeRanks({...newRouterParams, group: GROUPTYPE_GEOSUBDIV, filter: newRouterParams.filter});
          }
        } else {
          if (this.isPodcastChanged(newRouterParams) ||
              this.isMetricsTypeChanged(newRouterParams) || this.isGroupChanged(newRouterParams) ||
              this.isBeginDateChanged(newRouterParams) || this.isEndDateChanged(newRouterParams)) {
            this.loadPodcastTotals(newRouterParams);
          }
          if (this.isPodcastChanged(newRouterParams) ||
              this.isMetricsTypeChanged(newRouterParams) || this.isGroupChanged(newRouterParams) ||
              this.isBeginDateChanged(newRouterParams) || this.isEndDateChanged(newRouterParams) ||
              this.isIntervalChanged(newRouterParams)) {
            this.loadPodcastRanks(newRouterParams);
          }
          if (newRouterParams.group === GROUPTYPE_GEOCOUNTRY && newRouterParams.filter &&
            (this.isFilterChanged(newRouterParams) || this.isPodcastChanged(newRouterParams) ||
              this.isBeginDateChanged(newRouterParams) || this.isEndDateChanged(newRouterParams))) {
            this.loadPodcastTotals({...newRouterParams, group: GROUPTYPE_GEOSUBDIV, filter: newRouterParams.filter});
          }
          if (newRouterParams.group === GROUPTYPE_GEOCOUNTRY && newRouterParams.filter &&
            (this.isFilterChanged(newRouterParams) || this.isPodcastChanged(newRouterParams) ||
              this.isBeginDateChanged(newRouterParams) || this.isEndDateChanged(newRouterParams) ||
              this.isIntervalChanged(newRouterParams))) {
            this.loadPodcastRanks({...newRouterParams, group: GROUPTYPE_GEOSUBDIV, filter: newRouterParams.filter});
          }
        }
        break;
      case METRICSTYPE_TRAFFICSOURCES:
        if (this.aggregateSelectedEpisodeGuids && this.aggregateSelectedEpisodeGuids.length) {
          if (this.isMetricsTypeChanged(newRouterParams) || this.isGroupChanged(newRouterParams) ||
              this.isBeginDateChanged(newRouterParams) || this.isEndDateChanged(newRouterParams)) {
            this.loadEpisodeTotals(newRouterParams);
          }
          if (this.isMetricsTypeChanged(newRouterParams) || this.isGroupChanged(newRouterParams) ||
              this.isBeginDateChanged(newRouterParams) || this.isEndDateChanged(newRouterParams) ||
              this.isIntervalChanged(newRouterParams)) {
            this.loadEpisodeRanks(newRouterParams);
          }
        } else {
          if (this.isPodcastChanged(newRouterParams) ||
              this.isMetricsTypeChanged(newRouterParams) || this.isGroupChanged(newRouterParams) ||
              this.isBeginDateChanged(newRouterParams) || this.isEndDateChanged(newRouterParams)) {
            this.loadPodcastTotals(newRouterParams);
          }
          if (this.isPodcastChanged(newRouterParams) ||
              this.isMetricsTypeChanged(newRouterParams) || this.isGroupChanged(newRouterParams) ||
              this.isBeginDateChanged(newRouterParams) || this.isEndDateChanged(newRouterParams) ||
              this.isIntervalChanged(newRouterParams)) {
            this.loadPodcastRanks(newRouterParams);
          }
          break;
        }
    }
  }

  normalizeAndRoute(newRouterParams: PartialRouterParams): RouterParams {
    const routerParams: RouterParams = this.checkAndGetDefaults({ ...this.routerParams, ...newRouterParams });

    const params = {};
    if (routerParams.episodePage) {
      params['episodePage'] = routerParams.episodePage;
    }
    if (routerParams.standardRange) {
      params['standardRange'] = routerParams.standardRange;
    }
    if (routerParams.beginDate) {
      params['beginDate'] = routerParams.beginDate.toUTCString();
    }
    if (routerParams.endDate) {
      params['endDate'] = routerParams.endDate.toUTCString();
    }
    if (routerParams.days) {
      params['days'] = routerParams.days;
    }
    if (routerParams.metricsType === METRICSTYPE_DEMOGRAPHICS && routerParams.group === GROUPTYPE_GEOCOUNTRY) {
      params['filter'] = routerParams.filter;
    }

    localStorageUtil.setItem(localStorageUtil.KEY_ROUTER_PARAMS, routerParams);

    switch (routerParams.metricsType) {
      case METRICSTYPE_DROPDAY:
      case METRICSTYPE_DOWNLOADS:
        this.router.navigate([
          routerParams.podcastId,
          routerParams.metricsType,
          routerParams.chartType,
          routerParams.interval.key,
          params
        ]);
        break;
      case METRICSTYPE_DEMOGRAPHICS:
      case METRICSTYPE_TRAFFICSOURCES:
        this.router.navigate([
          routerParams.podcastId,
          routerParams.metricsType,
          routerParams.group,
          routerParams.chartType,
          routerParams.interval.key,
          params
        ]);
        break;
    }
    return routerParams;
  }

  checkAndGetDefaults(routerParams: RouterParams) {
    if (!routerParams.metricsType) {
      routerParams.metricsType = METRICSTYPE_DOWNLOADS;
    }
    switch (routerParams.metricsType) {
      case METRICSTYPE_DOWNLOADS:
        if (!routerParams.chartType || routerParams.chartType === CHARTTYPE_HORIZBAR || routerParams.chartType === CHARTTYPE_GEOCHART) {
          routerParams.chartType = CHARTTYPE_PODCAST;
        } else if (routerParams.chartType === CHARTTYPE_LINE) {
          routerParams.chartType = CHARTTYPE_EPISODES;
        }
        break;
      case METRICSTYPE_DROPDAY:
        // the only type
        routerParams.chartType = CHARTTYPE_EPISODES;
        break;
      case METRICSTYPE_TRAFFICSOURCES:
        if (!routerParams.chartType || routerParams.chartType === CHARTTYPE_PODCAST || routerParams.chartType === CHARTTYPE_GEOCHART) {
          routerParams.chartType = CHARTTYPE_HORIZBAR;
        } else if (routerParams.chartType === CHARTTYPE_EPISODES) {
          routerParams.chartType = CHARTTYPE_LINE;
        }
        break;
      case METRICSTYPE_DEMOGRAPHICS:
        if (!routerParams.chartType || routerParams.chartType === CHARTTYPE_PODCAST || routerParams.chartType === CHARTTYPE_HORIZBAR) {
          routerParams.chartType = CHARTTYPE_GEOCHART;
        } else if (routerParams.chartType === CHARTTYPE_EPISODES) {
          routerParams.chartType = CHARTTYPE_LINE;
        }
        break;
    }

    if (routerParams.metricsType === METRICSTYPE_TRAFFICSOURCES &&
      (!routerParams.group ||
        routerParams.group === GROUPTYPE_GEOCOUNTRY ||
        routerParams.group === GROUPTYPE_GEOMETRO ||
        routerParams.group === GROUPTYPE_GEOSUBDIV)) {
      routerParams.group = GROUPTYPE_AGENTOS;
    } else if (routerParams.metricsType === METRICSTYPE_DEMOGRAPHICS &&
      (!routerParams.group ||
        routerParams.group === GROUPTYPE_AGENTOS ||
        routerParams.group === GROUPTYPE_AGENTNAME ||
        routerParams.group === GROUPTYPE_AGENTTYPE)) {
      routerParams.group = GROUPTYPE_GEOCOUNTRY;
    }

    if (!routerParams.interval) {
      routerParams.interval = INTERVAL_DAILY;
    }
    if (routerParams.metricsType === METRICSTYPE_DOWNLOADS && !routerParams.episodePage) {
      routerParams.episodePage = 1;
    }

    if (routerParams.metricsType === METRICSTYPE_DROPDAY) {
      if (!routerParams.days) {
        routerParams.days = 28;
      }
      if (routerParams.interval === INTERVAL_HOURLY && routerParams.days > 7) {
        routerParams.days = 7;
      }
    } else {
      if (!routerParams.standardRange) {
        routerParams.standardRange = dateUtil.LAST_28_DAYS;
      }
      if (!routerParams.beginDate) {
        routerParams.beginDate = dateUtil.beginningOfLast28DaysUTC().toDate();
      }
      if (!routerParams.endDate) {
        routerParams.endDate = dateUtil.endOfTodayUTC().toDate();
      }
    }
    return routerParams;
  }

  isMetricsTypeChanged(newRouterParams: RouterParams): boolean {
    return newRouterParams && newRouterParams.metricsType &&
      (!this.routerParams || this.routerParams.metricsType !== newRouterParams.metricsType);
  }

  isGroupChanged(newRouterParams: RouterParams): boolean {
    return newRouterParams && newRouterParams.group &&
      (!this.routerParams || this.routerParams.group !== newRouterParams.group);
  }

  isFilterChanged(newRouterParams: RouterParams): boolean {
    return newRouterParams && newRouterParams.filter &&
      (!this.routerParams || this.routerParams.filter !== newRouterParams.filter);
  }

  isPodcastChanged(newRouterParams: RouterParams): boolean {
    return newRouterParams && newRouterParams.podcastId &&
      (!this.routerParams || this.routerParams.podcastId !== newRouterParams.podcastId);
  }

  isEpisodePageChanged(newRouterParams: RouterParams): boolean {
    return newRouterParams &&
      (!newRouterParams.episodePage || !this.routerParams || this.routerParams.episodePage !== newRouterParams.episodePage);
  }

  isBeginDateChanged(newRouterParams: RouterParams): boolean {
    return newRouterParams && newRouterParams.beginDate &&
      (!this.routerParams || !this.routerParams.beginDate || this.routerParams.beginDate.valueOf() !== newRouterParams.beginDate.valueOf());
  }

  isEndDateChanged(newRouterParams: RouterParams): boolean {
    return newRouterParams && newRouterParams.endDate &&
      (!this.routerParams || !this.routerParams.endDate || this.routerParams.endDate.valueOf() !== newRouterParams.endDate.valueOf());
  }

  isIntervalChanged(newRouterParams: RouterParams): boolean {
    return newRouterParams && newRouterParams.interval &&
      (!this.routerParams || !this.routerParams.interval || this.routerParams.interval.value !== newRouterParams.interval.value);
  }

  isDropdaysChanged(newRouterParams: RouterParams): boolean {
    return newRouterParams && newRouterParams.days &&
      (!this.routerParams || !this.routerParams.days || this.routerParams.days !== newRouterParams.days);
  }

  loadEpisodes(newRouterParams: PartialRouterParams) {
    this.store.dispatch(new ACTIONS.CastleEpisodePageLoadAction({
      podcastId: newRouterParams.podcastId,
      page: newRouterParams.episodePage || 1,
      per: EPISODE_PAGE_SIZE
    }));
  }

  loadSelectEpisodes(newRouterParams: RouterParams) {
    this.store.dispatch(new ACTIONS.CastleEpisodeSelectPageLoadAction({
      podcastId: newRouterParams.podcastId,
      page: 1,
      per: EPISODE_SELECT_PAGE_SIZE
    }));
  }

  loadDownloads(newRouterParams) {
    this.store.dispatch(new ACTIONS.CastlePodcastDownloadsLoadAction({
      id: newRouterParams.podcastId,
      interval: newRouterParams.interval,
      beginDate: newRouterParams.beginDate,
      endDate: newRouterParams.endDate
    }));
    this.store.dispatch(new ACTIONS.CastlePodcastAllTimeDownloadsLoadAction({id: newRouterParams.podcastId}));
    this.episodes.forEach((episode: Episode) => {
      this.store.dispatch(new ACTIONS.CastleEpisodeAllTimeDownloadsLoadAction({
        podcastId: episode.podcastId,
        guid: episode.guid
      }));
      this.store.dispatch(new ACTIONS.CastleEpisodeDownloadsLoadAction({
        podcastId: episode.podcastId,
        page: episode.page,
        guid: episode.guid,
        interval: newRouterParams.interval,
        beginDate: newRouterParams.beginDate,
        endDate: newRouterParams.endDate
      }));
    });
  }

  loadDropdayEpisodeAllTimeDownloads() {
    this.dropdayEpisodes.forEach((episode: EpisodeDropday) => {
      this.store.dispatch(new ACTIONS.CastleEpisodeAllTimeDownloadsLoadAction({
        podcastId: episode.podcastId,
        guid: episode.guid
      }));
    });
  }

  loadSelectedEpisodeDropdays(newRouterParams) {
    this.dropdayEpisodes.forEach((episode: EpisodeDropday) => {
      this.store.dispatch(new ACTIONS.CastleEpisodeDropdayLoadAction({
        podcastId: episode.podcastId,
        guid: episode.guid,
        title: episode.title,
        interval: newRouterParams.interval,
        publishedAt: episode.publishedAt,
        days: newRouterParams.days
      }));
    });
  }

  loadPodcastTotals(newRouterParams: RouterParams) {
    this.store.dispatch(new ACTIONS.CastlePodcastTotalsLoadAction({
      podcastId: newRouterParams.podcastId,
      group: newRouterParams.group,
      filter: newRouterParams.filter,
      beginDate: newRouterParams.beginDate,
      endDate: newRouterParams.endDate
    }));
  }

  loadPodcastRanks(newRouterParams: RouterParams) {
    this.store.dispatch(new ACTIONS.CastlePodcastRanksLoadAction({
      podcastId: newRouterParams.podcastId,
      group: newRouterParams.group,
      filter: newRouterParams.filter,
      interval: newRouterParams.interval,
      beginDate: newRouterParams.beginDate,
      endDate: newRouterParams.endDate
    }));
  }

  loadEpisodeTotals(newRouterParams: RouterParams) {
    this.aggregateSelectedEpisodeGuids.forEach(guid => {
      this.store.dispatch(new ACTIONS.CastleEpisodeTotalsLoadAction({
        guid,
        group: newRouterParams.group,
        filter: newRouterParams.filter,
        beginDate: newRouterParams.beginDate,
        endDate: newRouterParams.endDate
      }));
    });
  }

  loadEpisodeRanks(newRouterParams: RouterParams) {
    this.aggregateSelectedEpisodeGuids.forEach(guid => {
      this.store.dispatch(new ACTIONS.CastleEpisodeRanksLoadAction({
        guid,
        group: newRouterParams.group,
        filter: newRouterParams.filter,
        interval: newRouterParams.interval,
        beginDate: newRouterParams.beginDate,
        endDate: newRouterParams.endDate
      }));
    });
  }
}
