import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { StoreModule, Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Angulartics2 } from 'angulartics2';

import { MockHalService, AuthModule, FancyFormModule } from 'ngx-prx-styleguide';
import { CoreModule, CastleService } from '../core';
import { SharedModule } from '../shared';
import { DownloadsComponent } from './downloads.component';
import { DownloadsChartContainerComponent } from './downloads-chart-container.component';
import { DownloadsChartPresentationComponent } from './downloads-chart-presentation.component';
import { DownloadsTableContainerComponent } from './downloads-table-container.component';
import { DownloadsTablePresentationComponent } from './downloads-table-presentation.component';
import { downloadsRouting } from './downloads.routing';

import { METRICSTYPE_DOWNLOADS, INTERVAL_DAILY, getMetricsProperty } from '../ngrx';
import { reducers } from '../ngrx/reducers';
import * as ACTIONS from '../ngrx/actions';

import { routerParams, episodes, podcast, ep0Downloads, ep1Downloads, podDownloads } from '../../testing/downloads.fixtures';

describe('DownloadsComponent', () => {
  let comp: DownloadsComponent;
  let fix: ComponentFixture<DownloadsComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let castle;
  let store: Store<any>;
  const metricsPropertyName = getMetricsProperty(routerParams.interval, routerParams.metricsType);

  beforeEach(async(() => {
    castle = new MockHalService();
    castle.root.mockList('prx:podcast-downloads', [{podDownloads}]);
    castle.root.mockList('prx:episode-downloads', [{ep0Downloads}]);

    TestBed.configureTestingModule({
      declarations: [
        DownloadsComponent,
        DownloadsChartContainerComponent,
        DownloadsChartPresentationComponent,
        DownloadsTableContainerComponent,
        DownloadsTablePresentationComponent
      ],
      imports: [
        CoreModule,
        RouterTestingModule,
        downloadsRouting,
        SharedModule,
        AuthModule,
        FancyFormModule,
        StoreModule.forRoot(reducers)
      ],
      providers: [
        {provide: CastleService, useValue: castle.root},
        {provide: Angulartics2, useValue: {
          eventTrack: new Subject<any>()
        }}
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DownloadsComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;
      store = TestBed.get(Store);
    });
  }));

  function dispatchLoad() {
    store.dispatch(new ACTIONS.CastlePodcastMetricsLoadAction({
      seriesId: podcast.seriesId,
      feederId: podcast.feederId,
      metricsType: METRICSTYPE_DOWNLOADS,
      interval: INTERVAL_DAILY,
      beginDate: new Date(),
      endDate: new Date()
    }));
  }

  function dispatchRouterNavigation() {
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerState: routerParams}));
  }

  function dispatchInvalidPodcastRouterNavigation() {
    store.dispatch(new ACTIONS.RoutePodcastAction({podcastId: '13', podcastSeriesId: 1234}));
  }

  function dispatchPodcasts() {
    store.dispatch(new ACTIONS.CmsPodcastsSuccessAction({podcasts: [podcast]}));
    store.dispatch(new ACTIONS.CastlePodcastPageSuccessAction(
      {podcasts: [{id: podcast.feederId, title: podcast.title}], page: 1, total: 1}));
  }

  function dispatchEpisodePage() {
    store.dispatch(new ACTIONS.CmsPodcastEpisodePageSuccessAction({episodes}));
    store.dispatch(new ACTIONS.CastleEpisodePageSuccessAction({
      episodes: episodes.map(e => {
        return {guid: e.guid, title: e.title, publishedAt: e.publishedAt, page: e.page, podcastId: e.feederId};
      }),
      page: 1,
      total: episodes.length
    }));
  }

  function dispatchPodcastMetrics() {
    store.dispatch(new ACTIONS.CastlePodcastMetricsSuccessAction({
      seriesId: podcast.seriesId,
      feederId: podcast.feederId,
      metricsPropertyName,
      metrics: podDownloads
    }));
  }

  function dispatchEpisodeMetrics() {
    store.dispatch(new ACTIONS.CastleEpisodeMetricsSuccessAction({
      seriesId: episodes[0].seriesId,
      page: episodes[0].page,
      feederId: episodes[0].feederId,
      guid: episodes[0].guid,
      metricsPropertyName,
      metrics: ep0Downloads
    }));
    store.dispatch(new ACTIONS.CastleEpisodeMetricsSuccessAction({
      seriesId: episodes[1].seriesId,
      page: episodes[1].page,
      feederId: episodes[1].feederId,
      guid: episodes[1].guid,
      metricsPropertyName,
      metrics: ep1Downloads
    }));
  }

  it('should show loading spinner when loading', () => {
    dispatchLoad();
    fix.detectChanges();
    expect(de.query(By.css('prx-spinner'))).not.toBeNull();
    dispatchPodcastMetrics();
    fix.detectChanges();
    expect(de.query(By.css('prx-spinner'))).toBeFalsy();
  });

  describe('after loading podcasts...', () => {
    beforeEach(() => {
      spyOn(comp, 'getPodcastMetrics').and.callThrough();
      spyOn(comp, 'getEpisodeMetrics').and.callThrough();
      dispatchPodcasts();
      dispatchRouterNavigation();
      dispatchEpisodePage();
      dispatchPodcastMetrics();
      dispatchEpisodeMetrics();
      fix.detectChanges();
    });

    it('should load podcast downloads', () => {
      expect(comp.getPodcastMetrics).toHaveBeenCalled();
    });

    it('should load episode downloads', () => {
      expect(comp.getEpisodeMetrics).toHaveBeenCalled();
    });

    it('should reload podcast and episode data if routerParams parameters change', () => {
      const beginDate = new Date();
      comp.store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerState: {episodePage: 2}}));
      comp.store.dispatch(new ACTIONS.CastleEpisodePageSuccessAction({
        episodes: [{
          guid: episodes[1].guid,
          title: episodes[1].title,
          publishedAt: episodes[1].publishedAt,
          page: episodes[1].page,
          podcastId: episodes[1].feederId
        }],
        page: 2,
        total: episodes.length
      }));
      comp.store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerState: {beginDate}}));
      expect(comp.getPodcastMetrics).toHaveBeenCalled();
      expect(comp.getEpisodeMetrics).toHaveBeenCalled();
    });

    it('should show a downloads table of episodes', () => {
      dispatchPodcasts();
      dispatchRouterNavigation();
      dispatchEpisodePage();
      // dispatch metrics again because this component sends the load action when updating itself
      dispatchPodcastMetrics();
      dispatchEpisodeMetrics();
      fix.detectChanges();
      expect(de.query(By.css('metrics-downloads-table'))).not.toBeNull();
    });
  });

  describe('podcast series id is not matched', () => {
    beforeEach(() => {
      spyOn(comp, 'getPodcastMetrics').and.callThrough();
      dispatchPodcasts();
      dispatchInvalidPodcastRouterNavigation();
      dispatchEpisodePage();
      dispatchPodcastMetrics();
      dispatchEpisodeMetrics();
      fix.detectChanges();
    });

    it('should handle an unmatched routed podcast series id', () => {
      expect(comp.getPodcastMetrics).not.toHaveBeenCalled();
    });
  });
});
