import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/operators/filter';
import { Store, select } from '@ngrx/store';
import { selectRoutedPageEpisodes, selectRouter } from '../../ngrx/reducers/selectors/';
import {
  RouterParams,
  Episode,
  MetricsType,
  ChartType,
  CHARTTYPE_PODCAST,
  CHARTTYPE_EPISODES,
  CHARTTYPE_LINE,
  CHARTTYPE_BAR,
  CHARTTYPE_HORIZBAR,
  INTERVAL_DAILY,
  METRICSTYPE_DEMOGRAPHICS,
  METRICSTYPE_DOWNLOADS,
  METRICSTYPE_TRAFFICSOURCES,
  GROUPTYPE_GEOCOUNTRY,
  GROUPTYPE_GEOMETRO,
  GROUPTYPE_GEOSUBDIV,
  GROUPTYPE_AGENTOS,
  GROUPTYPE_AGENTNAME,
  GROUPTYPE_AGENTTYPE
} from '../../ngrx/';
import * as localStorageUtil from '../../shared/util/local-storage.util';
import * as dateUtil from '../../shared/util/date/';
import * as ACTIONS from '../../ngrx/actions/';

@Injectable()
export class RoutingService {
  routerParams: RouterParams;
  episodes: Episode[];

  constructor (public store: Store<any>,
               private router: Router) {
    this.dontAllowRoot();
    this.subRoutedPageEpisodes();
    this.subRouterParams();
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
    switch (newRouterParams.metricsType) {
      case METRICSTYPE_DOWNLOADS:
        if (this.isPodcastChanged(newRouterParams) ||
          this.isEpisodesChanged(newRouterParams) || this.isMetricsTypeChanged(newRouterParams)) {
          this.loadEpisodes(newRouterParams);
        } else if (this.isBeginDateChanged(newRouterParams) ||
          this.isEndDateChanged(newRouterParams) || this.isIntervalChanged(newRouterParams)) {
          // if episode page or podcast didn't change, check if other router params changed and load metrics
          // otherwise episode page loading will trigger loading of metrics (in order to load metrics for each loaded episode on that page)
          this.loadDownloads(newRouterParams);
        }
        break;
      case METRICSTYPE_DEMOGRAPHICS:
      case METRICSTYPE_TRAFFICSOURCES:
        if (this.isPodcastChanged(newRouterParams) || this.isMetricsTypeChanged(newRouterParams) || this.isGroupChanged(newRouterParams) ||
          this.isBeginDateChanged(newRouterParams) || this.isEndDateChanged(newRouterParams)) {
          this.loadPodcastTotals(newRouterParams);
        }
        if (this.isPodcastChanged(newRouterParams) || this.isMetricsTypeChanged(newRouterParams) || this.isGroupChanged(newRouterParams) ||
          this.isBeginDateChanged(newRouterParams) || this.isEndDateChanged(newRouterParams) || this.isIntervalChanged(newRouterParams)) {
          this.loadPodcastRanks(newRouterParams);
        }
        break;
    }
  }

  normalizeAndRoute(newRouterParams: RouterParams): RouterParams {
    const routerParams: RouterParams = this.checkAndGetDefaults({ ...this.routerParams, ...newRouterParams});

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

    localStorageUtil.setItem(localStorageUtil.KEY_ROUTER_PARAMS, routerParams);

    switch (routerParams.metricsType) {
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
        if (!routerParams.chartType || routerParams.chartType === CHARTTYPE_HORIZBAR) {
          routerParams.chartType = <ChartType>CHARTTYPE_PODCAST;
        } else if (routerParams.chartType === <ChartType>CHARTTYPE_LINE) {
          routerParams.chartType = CHARTTYPE_EPISODES;
        }
        break;
      case METRICSTYPE_TRAFFICSOURCES:
        if (!routerParams.chartType || routerParams.chartType === CHARTTYPE_PODCAST) {
          routerParams.chartType = CHARTTYPE_HORIZBAR;
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
    if (!routerParams.episodePage) {
      routerParams.episodePage = 1;
    }
    if (!routerParams.standardRange) {
      routerParams.standardRange = dateUtil.LAST_28_DAYS;
    }
    if (!routerParams.beginDate) {
      routerParams.beginDate = dateUtil.beginningOfLast28DaysUTC().toDate();
    }
    if (!routerParams.endDate) {
      routerParams.endDate = dateUtil.endOfTodayUTC().toDate();
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

  isPodcastChanged(newRouterParams: RouterParams): boolean {
    return newRouterParams && newRouterParams.podcastId &&
      (!this.routerParams || this.routerParams.podcastId !== newRouterParams.podcastId);
  }

  isEpisodesChanged(newRouterParams: RouterParams): boolean {
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

  loadEpisodes(newRouterParams: RouterParams) {
    this.store.dispatch(new ACTIONS.CastleEpisodePageLoadAction({
      podcastId: newRouterParams.podcastId,
      page: newRouterParams.episodePage || 1,
      all: !this.routerParams || this.routerParams.podcastId !== newRouterParams.podcastId}));
  }

  loadDownloads(newRouterParams) {
    this.store.dispatch(new ACTIONS.CastlePodcastMetricsLoadAction({
      id: newRouterParams.podcastId,
      metricsType: newRouterParams.metricsType,
      interval: newRouterParams.interval,
      beginDate: newRouterParams.beginDate,
      endDate: newRouterParams.endDate
    }));
    this.store.dispatch(new ACTIONS.CastlePodcastPerformanceMetricsLoadAction({id: newRouterParams.podcastId}));
    this.episodes.forEach((episode: Episode) => {
      this.store.dispatch(new ACTIONS.CastleEpisodePerformanceMetricsLoadAction({
        podcastId: episode.podcastId,
        guid: episode.guid
      }));
      this.store.dispatch(new ACTIONS.CastleEpisodeMetricsLoadAction({
        podcastId: episode.podcastId,
        page: episode.page,
        guid: episode.guid,
        metricsType: newRouterParams.metricsType,
        interval: newRouterParams.interval,
        beginDate: newRouterParams.beginDate,
        endDate: newRouterParams.endDate
      }));
    });
  }

  loadPodcastTotals(newRouterParams: RouterParams) {
    this.store.dispatch(new ACTIONS.CastlePodcastTotalsLoadAction({
      id: newRouterParams.podcastId,
      group: newRouterParams.group,
      beginDate: newRouterParams.beginDate,
      endDate: newRouterParams.endDate
    }));
  }

  loadPodcastRanks(newRouterParams: RouterParams) {
    this.store.dispatch(new ACTIONS.CastlePodcastRanksLoadAction({
      id: newRouterParams.podcastId,
      group: newRouterParams.group,
      interval: newRouterParams.interval,
      beginDate: newRouterParams.beginDate,
      endDate: newRouterParams.endDate
    }));
  }
}
