import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared';
import { DownloadsChartComponent } from './downloads-chart.component';

import { PodcastReducer } from '../ngrx/reducers/podcast.reducer';
import { EpisodeReducer } from '../ngrx/reducers/episode.reducer';
import { PodcastMetricsReducer } from '../ngrx/reducers/podcast-metrics.reducer';
import { EpisodeMetricsReducer } from '../ngrx/reducers/episode-metrics.reducer';
import { FilterReducer } from '../ngrx/reducers/filter.reducer';

import { PodcastModel, EpisodeModel, FilterModel, INTERVAL_DAILY } from '../ngrx/model';

import { castlePodcastMetrics, castleEpisodeMetrics, castleFilter } from '../ngrx/actions/castle.action.creator';

describe('DownloadsChartComponent', () => {
  let comp: DownloadsChartComponent;
  let fix: ComponentFixture<DownloadsChartComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const podDownloads = [
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
  const epDownloads = [
    ['2017-08-27T00:00:00Z', 522],
    ['2017-08-28T00:00:00Z', 900],
    ['2017-08-29T00:00:00Z', 858],
    ['2017-08-30T00:00:00Z', 522],
    ['2017-08-31T00:00:00Z', 900],
    ['2017-09-01T00:00:00Z', 858],
    ['2017-09-02T00:00:00Z', 522],
    ['2017-09-03T00:00:00Z', 900],
    ['2017-09-04T00:00:00Z', 858],
    ['2017-09-05T00:00:00Z', 522],
    ['2017-09-06T00:00:00Z', 900],
    ['2017-09-07T00:00:00Z', 858]
  ];
  const podcast: PodcastModel = {
    doc: undefined,
    seriesId: 37800,
    feederId: '70',
    title: 'Pet Talks Daily'
  };
  const episode: EpisodeModel = {
    doc: undefined,
    seriesId: 37800,
    id: 123,
    publishedAt: new Date(),
    title: 'A Pet Talk Episode',
    guid: 'abcdefg'
  };
  const filter: FilterModel = {
    podcast,
    episodes: [episode],
    beginDate: new Date('2017-08-27T00:00:00Z'),
    endDate: new Date('2017-09-07T00:00:00Z'),
    interval: INTERVAL_DAILY
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DownloadsChartComponent
      ],
      imports: [
        RouterTestingModule,
        SharedModule,
        StoreModule.forRoot({
          filter: FilterReducer,
          podcast: PodcastReducer,
          episode: EpisodeReducer,
          podcastMetrics: PodcastMetricsReducer,
          episodeMetrics: EpisodeMetricsReducer
        })
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DownloadsChartComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      // call episode and podcast metrics to prime the store
      comp.store.dispatch(castleFilter(filter));
      comp.store.dispatch(castleEpisodeMetrics(episode, filter, 'downloads', epDownloads));
      comp.store.dispatch(castlePodcastMetrics(podcast, filter, 'downloads', podDownloads));
    });
  }));

  it('should transform podcast and episode data to chart models', () => {
    expect(comp.podcastChartData.data.length).toEqual(podDownloads.length);
    expect(comp.episodeChartData[0].label).toEqual(episode.title);
    expect(comp.episodeChartData[0].data.length).toEqual(epDownloads.length);
    expect(comp.chartData.length).toBe(2);
    expect(comp.chartData[comp.chartData.length - 1].label).toEqual('All Other Episodes');
  });

  it('should subtract episode data from podcast data for chart display', () => {
    expect(comp.chartData[comp.chartData.length - 1].data[0].value).toEqual(52000);
  });
});
