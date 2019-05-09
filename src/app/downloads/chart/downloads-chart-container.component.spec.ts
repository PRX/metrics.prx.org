import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';

import { reducers } from '@app/ngrx/reducers';

import * as ACTIONS from '@app/ngrx/actions';
import { EPISODE_PAGE_SIZE } from '@app/ngrx';

import { SharedModule } from '@app/shared';
import { DownloadsChartContainerComponent } from './downloads-chart-container.component';
import { DownloadsChartPresentationComponent } from './downloads-chart-presentation.component';
import { routerParams, episodes, podcast, ep0Downloads, ep1Downloads, podDownloads } from '../../../testing/downloads.fixtures';

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

      store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams}));
      store.dispatch(new ACTIONS.CastleEpisodePageSuccessAction({
        episodes,
        page: 1,
        per: EPISODE_PAGE_SIZE,
        total: episodes.length
      }));
      store.dispatch(new ACTIONS.CastleEpisodeDownloadsSuccessAction({
        podcastId: episodes[0].podcastId, page: episodes[0].page, guid: episodes[0].guid, downloads: ep0Downloads}));
      store.dispatch(new ACTIONS.CastleEpisodeDownloadsSuccessAction({
        podcastId: episodes[1].podcastId, page: episodes[1].page, guid: episodes[1].guid, downloads: ep1Downloads}));
      store.dispatch(new ACTIONS.CastlePodcastDownloadsSuccessAction({id: podcast.id, downloads: podDownloads}));
    });
  }));

  it('should have router params', () => {
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