import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';
import { FancyFormModule } from 'ngx-prx-styleguide';

import { SharedModule } from '@app/shared';
import { DownloadsTableContainerComponent } from './downloads-table-container.component';
import { DownloadsTablePresentationComponent } from './downloads-table-presentation.component';
import { SummaryTableComponent } from './summary-table.component';

import { reducers } from '@app/ngrx/reducers';
import { CHARTTYPE_EPISODES, EPISODE_PAGE_SIZE } from '@app/ngrx';
import * as ACTIONS from '@app/ngrx/actions';
import { routerParams, episodes, podcast, ep0Downloads, ep1Downloads, podDownloads } from '@testing/downloads.fixtures';

describe('DownloadsTableContainerComponent', () => {
  let comp: DownloadsTableContainerComponent;
  let fix: ComponentFixture<DownloadsTableContainerComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadsTableContainerComponent, DownloadsTablePresentationComponent, SummaryTableComponent],
      imports: [RouterTestingModule, SharedModule, FancyFormModule, StoreModule.forRoot(reducers)]
    })
      .compileComponents()
      .then(() => {
        fix = TestBed.createComponent(DownloadsTableContainerComponent);
        comp = fix.componentInstance;
        fix.detectChanges();
        de = fix.debugElement;
        el = de.nativeElement;
        store = TestBed.inject(Store);

        store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams }));
        store.dispatch(
          ACTIONS.CastleEpisodeDownloadsSuccess({
            page: episodes[0].page,
            podcastId: episodes[0].podcastId,
            guid: episodes[0].guid,
            downloads: ep0Downloads
          })
        );
        store.dispatch(
          ACTIONS.CastleEpisodeDownloadsSuccess({
            page: episodes[1].page,
            podcastId: episodes[1].podcastId,
            guid: episodes[1].guid,
            downloads: ep1Downloads
          })
        );
        store.dispatch(
          ACTIONS.CastleEpisodePageSuccess({
            episodes: episodes.map(e => {
              return { guid: e.guid, title: e.title, publishedAt: e.publishedAt, page: e.page, podcastId: e.podcastId };
            }),
            page: 1,
            per: EPISODE_PAGE_SIZE,
            total: episodes.length
          })
        );
        store.dispatch(ACTIONS.CastlePodcastDownloadsSuccess({ id: podcast.id, downloads: podDownloads }));

        jest.spyOn(store, 'dispatch');
      });
  }));

  it('should dispatch action on podcast chart toggle', () => {
    comp.onToggleChartPodcast({ id: routerParams.podcastId, charted: false });
    expect(store.dispatch).toHaveBeenCalledWith(ACTIONS.ChartTogglePodcast({ id: routerParams.podcastId, charted: false }));
  });

  it('should dispatch action on episode chart toggle', () => {
    comp.onToggleChartEpisode({ podcastId: routerParams.podcastId, guid: episodes[0].guid, charted: false });
    expect(store.dispatch).toHaveBeenCalledWith(
      ACTIONS.ChartToggleEpisode({ podcastId: routerParams.podcastId, guid: episodes[0].guid, charted: false })
    );
  });

  it('should dispatch action on chart single episode and route to episode chart', () => {
    comp.onChartSingleEpisode({ podcastId: routerParams.podcastId, guid: episodes[1].guid });
    expect(store.dispatch).toHaveBeenCalledWith(ACTIONS.ChartSingleEpisode({ podcastId: routerParams.podcastId, guid: episodes[1].guid }));
    expect(store.dispatch).toHaveBeenCalledWith(ACTIONS.RouteChartType({ chartType: CHARTTYPE_EPISODES }));
  });

  it('should dispatch routing action on episodePage change', () => {
    comp.onPageChange(2);
    expect(store.dispatch).toHaveBeenCalledWith(ACTIONS.RouteEpisodePage({ episodePage: 2 }));
  });
});
