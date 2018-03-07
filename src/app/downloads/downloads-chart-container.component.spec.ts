import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';

import { reducers } from '../ngrx/reducers';

import * as ACTIONS from '../ngrx/actions';
import { getMetricsProperty } from '../ngrx';

import { SharedModule } from '../shared';
import { DownloadsChartContainerComponent } from './downloads-chart-container.component';
import { DownloadsChartPresentationComponent } from './downloads-chart-presentation.component';
import { routerState, episodes, podcast, ep0Downloads, ep1Downloads, podDownloads } from '../../testing/downloads.fixtures';

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

      const metricsPropertyName = getMetricsProperty(routerState.interval, routerState.metricsType);

      store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerState}));
      store.dispatch(new ACTIONS.CmsPodcastEpisodePageSuccessAction({episodes}));
      store.dispatch(new ACTIONS.CastleEpisodeMetricsSuccessAction({
        seriesId: episodes[0].seriesId, page: episodes[0].page, id: episodes[0].id, guid: episodes[0].guid,
        metricsPropertyName, metrics: ep0Downloads}));
      store.dispatch(new ACTIONS.CastleEpisodeMetricsSuccessAction({
        seriesId: episodes[1].seriesId, page: episodes[1].page, id: episodes[1].id, guid: episodes[1].guid,
        metricsPropertyName, metrics: ep1Downloads}));
      store.dispatch(new ACTIONS.CastlePodcastMetricsSuccessAction({
        seriesId: podcast.seriesId, feederId: podcast.feederId, metricsPropertyName, metrics: podDownloads}));
    });
  }));

  it('should have router state', () => {
    let result;
    comp.routerState$.subscribe(value => result = value);
    expect(result).toEqual(routerState);
  });

  it('should have chart data', () => {
    let result;
    comp.chartData$.subscribe(value => result = value);
    expect(result.length).toEqual(3);
  });
});
