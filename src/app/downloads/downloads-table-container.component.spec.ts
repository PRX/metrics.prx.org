import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';
import { FancyFormModule } from 'ngx-prx-styleguide';

import { SharedModule } from '../shared';
import { DownloadsTableContainerComponent } from './downloads-table-container.component';
import { DownloadsTablePresentationComponent } from './downloads-table-presentation.component';

import { reducers } from '../ngrx/reducers';
import { CHARTTYPE_EPISODES, getMetricsProperty } from '../ngrx';
import * as ACTIONS from '../ngrx/actions';
import { routerParams, episodes, podcast, ep0Downloads, ep1Downloads, podDownloads } from '../../testing/downloads.fixtures';

describe('DownloadsTableContainerComponent', () => {
  let comp: DownloadsTableContainerComponent;
  let fix: ComponentFixture<DownloadsTableContainerComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;

  const metricsPropertyName = getMetricsProperty(routerParams.interval, routerParams.metricsType);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DownloadsTableContainerComponent,
        DownloadsTablePresentationComponent
      ],
      imports: [
        RouterTestingModule,
        SharedModule,
        FancyFormModule,
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DownloadsTableContainerComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
      store = TestBed.get(Store);

      store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerState: routerParams}));
      store.dispatch(new ACTIONS.CastleEpisodeMetricsSuccessAction({
        seriesId: episodes[0].seriesId, page: episodes[0].page, feederId: episodes[0].feederId, guid: episodes[0].guid,
        metricsPropertyName, metrics: ep0Downloads}));
      store.dispatch(new ACTIONS.CastleEpisodeMetricsSuccessAction({
        seriesId: episodes[1].seriesId, page: episodes[1].page, feederId: episodes[1].feederId, guid: episodes[1].guid,
        metricsPropertyName, metrics: ep1Downloads}));
      store.dispatch(new ACTIONS.CastleEpisodePageSuccessAction({
        episodes: episodes.map(e => {
          return {guid: e.guid, title: e.title, publishedAt: e.publishedAt, page: e.page, podcastId: e.feederId};
        }),
        page: 1,
        total: episodes.length
      }));
      store.dispatch(new ACTIONS.CastlePodcastMetricsSuccessAction({
        seriesId: podcast.seriesId, feederId: podcast.feederId, metricsPropertyName, metrics: podDownloads}));

      spyOn(store, 'dispatch').and.callThrough();
    });
  }));

  it('should dispatch routing action on podcast chart toggle', () => {
    comp.toggleChartPodcast(false);
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.RoutePodcastChartedAction({chartPodcast: false}));
  });

  it('should dispatch routing action on episode chart toggle', () => {
    comp.toggleChartEpisode({episodeId: episodes[0].id, charted: false});
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.RouteToggleEpisodeChartedAction({episodeId: 123, charted: false}));
  });

  it('should dispatch routing action on chart single episode', () => {
    comp.onChartSingleEpisode(episodes[1].id);
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.RouteSingleEpisodeChartedAction(
      {episodeId: 124, chartType: CHARTTYPE_EPISODES}));
  });

  it('should dispatch routing action on episodePage change', () => {
    comp.onPageChange(2);
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.RouteEpisodePageAction({episodePage: 2}));
  });
});
