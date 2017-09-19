import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { MockHalService } from 'ngx-prx-styleguide';
import { CoreModule, CastleService } from '../core';
import { SharedModule } from '../shared';
import { DownloadsComponent } from './downloads.component';
import { DownloadsChartComponent } from './downloads-chart.component';
import { DownloadsCannedrangeComponent } from './downloads-cannedrange.component';
import { DownloadsDaterangeComponent } from './downloads-daterange.component';

import { PodcastReducer } from '../ngrx/reducers/podcast.reducer';
import { EpisodeReducer } from '../ngrx/reducers/episode.reducer';
import { PodcastMetricsReducer } from '../ngrx/reducers/podcast-metrics.reducer';
import { EpisodeMetricsReducer } from '../ngrx/reducers/episode-metrics.reducer';
import { FilterReducer } from '../ngrx/reducers/filter.reducer';

import * as CastleActions from '../ngrx/actions/castle.action.creator';

describe('DownloadsComponent', () => {
  let comp: DownloadsComponent;
  let fix: ComponentFixture<DownloadsComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let castle;

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

    spyOn(CastleActions, 'castlePodcastMetrics').and.callThrough();
    spyOn(CastleActions, 'castleEpisodeMetrics').and.callThrough();

    TestBed.configureTestingModule({
      declarations: [
        DownloadsComponent,
        DownloadsChartComponent,
        DownloadsCannedrangeComponent,
        DownloadsDaterangeComponent
      ],
      imports: [
        CoreModule,
        RouterTestingModule,
        SharedModule,
        StoreModule.provideStore({
          filter: FilterReducer,
          podcast: PodcastReducer,
          episode: EpisodeReducer,
          podcastMetrics: PodcastMetricsReducer,
          episodeMetrics: EpisodeMetricsReducer
        })
      ],
      providers: [
        {provide: CastleService, useValue: castle.root}
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DownloadsComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should load podcast downloads and call CASTLE action', () => {
    comp.store.dispatch(CastleActions.castleFilter({podcast: {doc: undefined, seriesId: 37800, title: 'Pet Talks Daily'}}));
    expect(CastleActions.castlePodcastMetrics).toHaveBeenCalled();
  });

  it('should load episode downloads and call CASTLE action', () => {
    comp.store.dispatch(CastleActions.castleFilter({episodes:
      [{doc: undefined, id: 123, seriesId: 37800, title: 'A New Pet Talk Episode', publishedAt: new Date()}]}));
    expect(CastleActions.castleEpisodeMetrics).toHaveBeenCalled();
  });

  it ('should reload podcast and episode data if filter parameters change', () => {
    const beginDate = new Date(comp.filter.beginDate.valueOf() + 24 * 60 * 60 * 1000);
    comp.store.dispatch(CastleActions.castleFilter({podcast: {doc: undefined, seriesId: 37800, title: 'Pet Talks Daily'}}));
    comp.store.dispatch(CastleActions.castleFilter({episodes:
      [{doc: undefined, id: 123, seriesId: 37800, title: 'A New Pet Talk Episode', publishedAt: new Date()}]}));
    comp.store.dispatch(CastleActions.castleFilter({beginDate}));
    expect(CastleActions.castlePodcastMetrics).toHaveBeenCalledTimes(2);
    expect(CastleActions.castleEpisodeMetrics).toHaveBeenCalledTimes(2);
  });
});
