import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/operators/filter';
import { Store, select } from '@ngrx/store';
import { selectRoutedPageEpisodes, selectRouter } from '../../ngrx/reducers/selectors/';
import {
  RouterParams, Episode,
  MetricsType, ChartType, CHARTTYPE_PODCAST,
  INTERVAL_DAILY,
  METRICSTYPE_DEMOGRAPHICS,
  METRICSTYPE_DOWNLOADS,
  METRICSTYPE_TRAFFICSOURCES } from '../../ngrx/';
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
    this.subAndCheckRouterParams();
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

  subAndCheckRouterParams() {
    this.store.pipe(select(selectRouter)).subscribe(routerParams => {
      // don't do anything with setting route or loading metrics until podcast is set
      if (routerParams.podcastId) {
        // if this.routerParams has not yet been set, go through routing which checks for and sets defaults
        if (!this.routerParams) {
          this.normalizeAndRoute(routerParams);
        }

        // load episodes if podcast id changed or if the episode page changed or page has not been set
        if (this.isPodcastChanged(routerParams) || this.isEpisodesChanged(routerParams)) {
          this.loadEpisodes(routerParams);
        } else if (this.isBeginDateChanged(routerParams) || this.isEndDateChanged(routerParams) || this.isIntervalChanged(routerParams)) {
          // if episode page or podcast didn't change, check if other router params changed and load metrics
          // otherwise episode page loading will trigger loading of metrics (in order to load metrics for each loaded episode on that page)
          this.loadMetrics(routerParams);
        }
        this.routerParams = routerParams;
      }
    });
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
    if (routerParams.chartPodcast !== undefined) {
      params['chartPodcast'] = routerParams.chartPodcast;
    } else if (routerParams.metricsType === METRICSTYPE_DOWNLOADS) {
      params['chartPodcast'] = true; // true is the default for downloads
    }
    if (routerParams.episodeIds) {
      params['episodes'] = routerParams.episodeIds.join(',');
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
    if (!routerParams.chartType) {
      routerParams.chartType = <ChartType>CHARTTYPE_PODCAST;
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
      (!this.routerParams.beginDate || this.routerParams.beginDate.valueOf() !== newRouterParams.beginDate.valueOf());
  }

  isEndDateChanged(newRouterParams: RouterParams): boolean {
    return newRouterParams && newRouterParams.endDate &&
      (!this.routerParams.endDate || this.routerParams.endDate.valueOf() !== newRouterParams.endDate.valueOf());
  }

  isIntervalChanged (newRouterParams: RouterParams): boolean {
    return newRouterParams && newRouterParams.interval &&
      (!this.routerParams.interval || this.routerParams.interval.value !== newRouterParams.interval.value);
  }

  loadEpisodes(newRouterParams: RouterParams) {
    this.store.dispatch(new ACTIONS.CastleEpisodePageLoadAction({
      podcastId: newRouterParams.podcastId,
      page: newRouterParams.episodePage || 1,
      all: !this.routerParams || this.routerParams.podcastId !== newRouterParams.podcastId}));
  }

  loadMetrics(newRouterParams: RouterParams) {
    this.store.dispatch(new ACTIONS.CastlePodcastMetricsLoadAction({
      id: newRouterParams.podcastId,
      metricsType: newRouterParams.metricsType,
      interval: newRouterParams.interval,
      beginDate: newRouterParams.beginDate,
      endDate: newRouterParams.endDate
    }));
    this.store.dispatch(new ACTIONS.CastlePodcastPerformanceMetricsLoadAction({id: newRouterParams.podcastId}));
    return this.episodes.forEach((episode: Episode) => {
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
}
