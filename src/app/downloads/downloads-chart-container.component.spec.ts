import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';

import { reducers } from '../ngrx/reducers';

import * as ACTIONS from '../ngrx/actions';
import { getMetricsProperty } from '../ngrx';

import { SharedModule } from '../shared';
import { DownloadsChartContainerComponent } from './downloads-chart-container.component';
import { DownloadsChartPresentationComponent } from './downloads-chart-presentation.component';
import { routerParams, episodes, podcast, ep0Downloads, ep1Downloads, podDownloads } from '../../testing/downloads.fixtures';

describe('DownloadsChartContainerComponent', () => {
  let comp: DownloadsChartContainerComponent;
  let fix: ComponentFixture<DownloadsChartContainerComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DownloadsChartContainerComponent,
        DownloadsChartPresentationComponent
      ],
      imports: [
        SharedModule,
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DownloadsChartContainerComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
      store = TestBed.get(Store);

      const metricsPropertyName = getMetricsProperty(routerParams.interval, routerParams.metricsType);

      store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams}));
      store.dispatch(new ACTIONS.CastleEpisodePageSuccessAction({
        episodes: episodes.map(e => {
          return {guid: e.guid, title: e.title, publishedAt: e.publishedAt, page: e.page, podcastId: e.feederId};
        }),
        page: 1,
        total: episodes.length
      }));
      store.dispatch(new ACTIONS.CastleEpisodeMetricsSuccessAction({
        seriesId: episodes[0].seriesId, feederId: episodes[0].feederId, page: episodes[0].page, guid: episodes[0].guid,
        metricsPropertyName, metrics: ep0Downloads}));
      store.dispatch(new ACTIONS.CastleEpisodeMetricsSuccessAction({
        seriesId: episodes[1].seriesId, feederId: episodes[1].feederId, page: episodes[1].page, guid: episodes[1].guid,
        metricsPropertyName, metrics: ep1Downloads}));
      store.dispatch(new ACTIONS.CastlePodcastMetricsSuccessAction({
        seriesId: podcast.seriesId, feederId: podcast.feederId, metricsPropertyName, metrics: podDownloads}));
    });
  }));

  it('should have router state', () => {
    let result;
    comp.routerParams$.subscribe(value => result = value);
    expect(result).toEqual(routerParams);
  });

  it('should have chart data', () => {
    let result;
    comp.chartData$.subscribe(value => result = value);
    expect(result.length).toEqual(3);
  });
});
