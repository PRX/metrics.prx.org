import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { selectRoutedPageEpisodes, selectRouter,
  selectRoutedPodcastSelectedEpisodes, selectUserAuthorized } from '../../ngrx/reducers/selectors/';
import {
  RouterParams,
  Episode,
  MetricsType,
  ChartType,
  CHARTTYPE_PODCAST,
  CHARTTYPE_EPISODES,
  CHARTTYPE_LINE,
  CHARTTYPE_HORIZBAR,
  CHARTTYPE_GEOCHART,
  CHARTTYPE_STACKED,
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
  METRICSTYPE_DROPDAY
} from '../../ngrx/';
import * as localStorageUtil from '../../shared/util/local-storage.util';
import * as dateUtil from '../../shared/util/date/';
import * as ACTIONS from '../../ngrx/actions/';

@Injectable()
export class RoutingService {
  routerParams: RouterParams;
  episodes: Episode[];
  selectedEpisodes: Episode[];

  constructor (public store: Store<any>,
               private router: Router) {
    // don't start watching anything until user is authorized
    let subscribed = false;
    this.store.pipe(select(selectUserAuthorized)).subscribe(authorized => {
      if (!subscribed && authorized) {
        this.dontAllowRoot();
        this.subRoutedPageEpisodes();
        this.subSelectedEpisodes();
        this.subRouterParams();
        subscribed = true;
      }
    });
  }

  dontAllowRoot() {
    // for redirecting users routed to '/'
    this.router.events.pipe(
      filter(event => event instanceof RoutesRecognized)
    ).subscribe((event: RoutesRecognized) => {
      if (event.url === '/' && this.routerParams && this.routerParams.podcastId) {
        this.normalizeAndRoute(this.routerParams);
      }
    });
  }

  subRoutedPageEpisodes() {
    this.store.pipe(select(selectRoutedPageEpisodes)).subscribe((episodes: Episode[]) => {
      this.episodes = episodes;
    });
  }

  subSelectedEpisodes() {
    this.store.pipe(select(selectRoutedPodcastSelectedEpisodes)).subscribe((episodes: Episode[]) => {
      this.selectedEpisodes = episodes;
    });
  }

  subRouterParams() {
    this.store.pipe(select(selectRouter)).subscribe(routerParams => {
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
          if ((!this.selectedEpisodes || !this.selectedEpisodes.length)) {
            // just landed on dropdays but there no selected episodes
            // want to show the first page of episodes, but we likely don't have that...
            // so load the first page of episodes
            //  + an effect to loadRoutedDropdays when page 1 of episodes loads on dropdays and also select that page of episodes
            this.loadEpisodes({podcastId: newRouterParams.podcastId, episodePage: 1});
          } else {
            this.loadSelectedEpisodeAllTimeDownloads(newRouterParams);
            this.loadSelectedEpisodeDropdays(newRouterParams);
          }
        } else if (this.selectedEpisodes && this.selectedEpisodes.length &&
                  (this.isDropdaysChanged(newRouterParams) || this.isIntervalChanged(newRouterParams))) {
            // were already in dropdays w/ selected episodes but days or interval params changed
          this.loadSelectedEpisodeDropdays(newRouterParams);
        }
        break;
      case METRICSTYPE_DEMOGRAPHICS:
        if (this.selectedEpisodes && this.selectedEpisodes.length > 0) {
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
        if (this.selectedEpisodes && this.selectedEpisodes.length) {
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

  normalizeAndRoute(newRouterParams: RouterParams): RouterParams {
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
      routerParams.metricsType = <MetricsType>METRICSTYPE_DOWNLOADS;
    }
    switch (routerParams.metricsType) {
      case METRICSTYPE_DOWNLOADS:
        if (!routerParams.chartType || routerParams.chartType === CHARTTYPE_HORIZBAR || routerParams.chartType === CHARTTYPE_GEOCHART) {
          routerParams.chartType = <ChartType>CHARTTYPE_PODCAST;
        } else if (routerParams.chartType === <ChartType>CHARTTYPE_LINE) {
          routerParams.chartType = CHARTTYPE_EPISODES;
        }
        break;
      case METRICSTYPE_DROPDAY:
        if (!routerParams.chartType || routerParams.chartType === CHARTTYPE_PODCAST || routerParams.chartType === CHARTTYPE_GEOCHART) {
          routerParams.chartType = <ChartType>CHARTTYPE_HORIZBAR;
        } else if (routerParams.chartType === <ChartType>CHARTTYPE_LINE || routerParams.chartType === <ChartType>CHARTTYPE_STACKED) {
          routerParams.chartType = CHARTTYPE_EPISODES;
        }
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

  loadEpisodes(newRouterParams: RouterParams) {
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

  loadSelectedEpisodeAllTimeDownloads(newRouterParams) {
    this.selectedEpisodes.forEach((episode: Episode) => {
      this.store.dispatch(new ACTIONS.CastleEpisodeAllTimeDownloadsLoadAction({
        podcastId: newRouterParams.podcastId || this.routerParams.podcastId,
        guid: episode.guid
      }));
    });
  }

  loadSelectedEpisodeDropdays(newRouterParams) {
    this.selectedEpisodes.forEach((episode: Episode) => {
      this.store.dispatch(new ACTIONS.CastleEpisodeDropdayLoadAction({
        podcastId: newRouterParams.podcastId || this.routerParams.podcastId,
        guid: episode.guid,
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
    this.selectedEpisodes.forEach(episode => {
      this.store.dispatch(new ACTIONS.CastleEpisodeTotalsLoadAction({
        guid: episode.guid,
        group: newRouterParams.group,
        filter: newRouterParams.filter,
        beginDate: newRouterParams.beginDate,
        endDate: newRouterParams.endDate
      }));
    });
  }

  loadEpisodeRanks(newRouterParams: RouterParams) {
    this.selectedEpisodes.forEach(episode => {
      this.store.dispatch(new ACTIONS.CastleEpisodeRanksLoadAction({
        guid: episode.guid,
        group: newRouterParams.group,
        filter: newRouterParams.filter,
        interval: newRouterParams.interval,
        beginDate: newRouterParams.beginDate,
        endDate: newRouterParams.endDate
      }));
    });
  }
}
