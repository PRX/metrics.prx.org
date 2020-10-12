import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';
import { first } from 'rxjs/operators';

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
      declarations: [DownloadsChartContainerComponent, DownloadsChartPresentationComponent],
      imports: [SharedModule, StoreModule.forRoot(reducers)]
    })
      .compileComponents()
      .then(() => {
        fix = TestBed.createComponent(DownloadsChartContainerComponent);
        comp = fix.componentInstance;
        fix.detectChanges();
        de = fix.debugElement;
        el = de.nativeElement;
        store = TestBed.inject(Store);

        store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams }));
        store.dispatch(
          ACTIONS.CastleEpisodePageSuccess({
            episodes,
            page: 1,
            per: EPISODE_PAGE_SIZE,
            total: episodes.length
          })
        );
        store.dispatch(
          ACTIONS.CastleEpisodeDownloadsSuccess({
            podcastId: episodes[0].podcastId,
            page: episodes[0].page,
            guid: episodes[0].guid,
            downloads: ep0Downloads
          })
        );
        store.dispatch(
          ACTIONS.CastleEpisodeDownloadsSuccess({
            podcastId: episodes[1].podcastId,
            page: episodes[1].page,
            guid: episodes[1].guid,
            downloads: ep1Downloads
          })
        );
        store.dispatch(ACTIONS.CastlePodcastDownloadsSuccess({ id: podcast.id, downloads: podDownloads }));
      });
  }));

  it('should have router params', done => {
    comp.routerParams$.pipe(first()).subscribe(result => {
      expect(result).toEqual(routerParams);
      done();
    });
  });

  it('should have chart data', done => {
    comp.chartData$.pipe(first()).subscribe(result => {
      expect(result.length).toEqual(3);
      done();
    });
  });
});
