import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { StoreModule, Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Angulartics2 } from 'angulartics2';

import { MockHalService, MockHalDoc, AuthModule, FancyFormModule } from 'ngx-prx-styleguide';
import { CoreModule, CastleService } from '../core';
import { SharedModule } from '../shared';
import { DownloadsComponent } from './downloads.component';
import { DownloadsChartComponent } from './downloads-chart.component';
import { DownloadsTableComponent } from './downloads-table.component';
import { downloadsRouting } from './downloads.routing';

import { EpisodeModel, PodcastModel, MetricsType,
  METRICSTYPE_DOWNLOADS, INTERVAL_DAILY, getMetricsProperty } from '../ngrx';
import { reducers } from '../ngrx/reducers';
import * as ACTIONS from '../ngrx/actions';

describe('DownloadsComponent', () => {
  let comp: DownloadsComponent;
  let fix: ComponentFixture<DownloadsComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let castle;
  let store: Store<any>;

  const podcast: PodcastModel = {
    seriesId: 37800,
    feederId: '70',
    title: 'Pet Talks Daily'
  };
  podcast['doc'] = new MockHalDoc(podcast);
  const episode: EpisodeModel = {
    id: 1,
    page: 1,
    guid: 'abcde',
    seriesId: 37800,
    title: 'A Pet Talks Episode',
    publishedAt: new Date()
  };
  const downloads = [
    ['2017-08-27T00:00:00Z', 52522],
    ['2017-08-28T00:00:00Z', 162900],
    ['2017-08-29T00:00:00Z', 46858],
    ['2017-08-30T00:00:00Z', 52522],
    ['2017-08-31T00:00:00Z', 162900],
    ['2017-09-01T00:00:00Z', 46858],
    ['2017-09-02T00:00:00Z', 52522],
    ['2017-09-03T00:00:00Z', 162900],
    ['2017-09-04T00:00:00Z', 46858],
    ['2017-09-05T00:00:00Z', 52522],
    ['2017-09-06T00:00:00Z', 162900],
    ['2017-09-07T00:00:00Z', 46858]
  ];

  beforeEach(async(() => {
    castle = new MockHalService();
    castle.root.mockList('prx:podcast-downloads', [{downloads}]);
    castle.root.mockList('prx:episode-downloads', [{downloads}]);

    TestBed.configureTestingModule({
      declarations: [
        DownloadsComponent,
        DownloadsChartComponent,
        DownloadsTableComponent
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

  function dispatchPodcastMetrics() {
    store.dispatch(new ACTIONS.CastlePodcastMetricsSuccessAction({
      seriesId: podcast.seriesId,
      feederId: podcast.feederId,
      metricsPropertyName: getMetricsProperty(INTERVAL_DAILY, <MetricsType>METRICSTYPE_DOWNLOADS),
      metrics: downloads
    }));
  }

  function dispatchEpisodeMetrics() {
    store.dispatch(new ACTIONS.CastleEpisodeMetricsSuccessAction({
      seriesId: podcast.seriesId,
      page: episode.page,
      id: episode.id,
      guid: episode.guid,
      metricsPropertyName: getMetricsProperty(INTERVAL_DAILY, <MetricsType>METRICSTYPE_DOWNLOADS),
      metrics: downloads
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
      store.dispatch(new ACTIONS.CustomRouterNavigationAction({
        routerState: {podcastSeriesId: 37800, page: 1}
      }));
      store.dispatch(new ACTIONS.CmsPodcastsSuccessAction({podcasts: [podcast]}));
      store.dispatch(new ACTIONS.CmsPodcastEpisodePageSuccessAction({episodes: [episode]}));
      dispatchPodcastMetrics();
      dispatchEpisodeMetrics();
      comp.podcasts = [podcast];
      fix.detectChanges();
    });

    it('should load podcast downloads', () => {
      spyOn(comp, 'getPodcastMetrics').and.callThrough();
      expect(comp.getPodcastMetrics).toHaveBeenCalled();
    });

    it('should load episode downloads', () => {
      spyOn(comp, 'getEpisodeMetrics').and.callThrough();
      expect(comp.getEpisodeMetrics).toHaveBeenCalled();
    });

/*
    it('should reload podcast and episode data if routerState parameters change', () => {
      const beginDate = new Date();
      comp.store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerState: {page: 1}}));
      comp.store.dispatch(new ACTIONS.CmsPodcastEpisodePageSuccessAction({episodes:
        [{
          id: 123,
          seriesId: 37800,
          title: 'A New Pet Talk Episode',
          publishedAt: new Date(),
          guid: 'abcdefg',
          page: 1
        }]
      }));
      comp.store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerState: {beginDate}}));
      expect(comp.setPodcastMetrics).toHaveBeenCalledTimes(2);
      expect(comp.setEpisodeMetrics).toHaveBeenCalledTimes(2);
      expect(comp.googleAnalyticsEvent).toHaveBeenCalledTimes(2);
      expect(comp.store.dispatch).toHaveBeenCalledWith(jasmine.any(ACTIONS.CastlePodcastMetricsSuccessAction));
      expect(comp.store.dispatch).toHaveBeenCalledWith(jasmine.any(ACTIONS.CastleEpisodeMetricsSuccessAction));
    });*/

    it('should show a downloads table of episodes', () => {
      console.log(de.nativeElement);
      expect(de.query(By.css('metrics-downloads-table'))).not.toBeNull();
    });
  });
});
