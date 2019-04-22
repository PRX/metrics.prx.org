import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StoreModule, Store } from '@ngrx/store';

import { FancyFormModule } from 'ngx-prx-styleguide';
import { SharedModule } from '@app/shared';
import { DownloadsComponent } from './downloads.component';
import { DownloadsChartContainerComponent } from './chart/downloads-chart-container.component';
import { DownloadsChartPresentationComponent } from './chart/downloads-chart-presentation.component';
import { DownloadsTableContainerComponent } from './table/downloads-table-container.component';
import { DownloadsTablePresentationComponent } from './table/downloads-table-presentation.component';
import { ScrollingTableComponent } from './table/scrolling-table.component';
import { SummaryTableComponent } from './table/summary-table.component';

import { EPISODE_PAGE_SIZE } from '@app/ngrx';
import { reducers } from '@app/ngrx/reducers';
import * as ACTIONS from '@app/ngrx/actions';

import { routerParams, podcast, episodes, ep0Downloads, ep1Downloads, podDownloads } from '@testing/downloads.fixtures';

describe('DownloadsComponent', () => {
  let comp: DownloadsComponent;
  let fix: ComponentFixture<DownloadsComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DownloadsComponent,
        DownloadsChartContainerComponent,
        DownloadsChartPresentationComponent,
        DownloadsTableContainerComponent,
        DownloadsTablePresentationComponent,
        ScrollingTableComponent,
        SummaryTableComponent
      ],
      imports: [
        SharedModule,
        FancyFormModule,
        StoreModule.forRoot(reducers)
      ],
      providers: []
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DownloadsComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;
      store = TestBed.get(Store);
    });
  }));

  function dispatchRouterNavigation() {
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams}));
  }

  function dispatchPodcasts() {
    store.dispatch(new ACTIONS.CastlePodcastPageSuccessAction(
      {podcasts: [podcast], page: 1, total: 1}));
  }

  function dispatchEpisodePage() {
    store.dispatch(new ACTIONS.CastleEpisodePageSuccessAction({
      episodes,
      page: 1,
      per: EPISODE_PAGE_SIZE,
      total: episodes.length
    }));
  }

  function dispatchPodcastDownloads() {
    store.dispatch(new ACTIONS.CastlePodcastDownloadsSuccessAction({
      id: podcast.id,
      downloads: podDownloads
    }));
  }

  function dispatchEpisodeMetrics() {
    store.dispatch(new ACTIONS.CastleEpisodeDownloadsSuccessAction({
      podcastId: episodes[0].podcastId,
      page: episodes[0].page,
      guid: episodes[0].guid,
      downloads: ep0Downloads
    }));
    store.dispatch(new ACTIONS.CastleEpisodeDownloadsSuccessAction({
      podcastId: episodes[1].podcastId,
      page: episodes[1].page,
      guid: episodes[1].guid,
      downloads: ep1Downloads
    }));
  }

  it('should show loading spinner when loading', () => {
    fix.detectChanges();
    expect(de.query(By.css('prx-spinner'))).not.toBeNull();
  });

  it('should show a downloads table', () => {
    dispatchPodcasts();
    dispatchRouterNavigation();
    dispatchEpisodePage();
    dispatchPodcastDownloads();
    dispatchEpisodeMetrics();
    fix.detectChanges();
    expect(de.query(By.css('prx-spinner'))).toBeNull();
    expect(de.query(By.css('metrics-downloads-table'))).not.toBeNull();
  });

});
