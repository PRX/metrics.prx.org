import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared';
import { DownloadsChartComponent } from './downloads-chart.component';

import { reducers, PodcastModel } from '../ngrx/reducers';
import { EpisodeModel, FilterModel, INTERVAL_DAILY } from '../ngrx/model';
import { CmsAllPodcastEpisodeGuidsAction,
  CastlePodcastMetricsAction, CastleEpisodeMetricsAction, CastleFilterAction } from '../ngrx/actions';

import { getTotal } from '../shared/util/metrics.util';
import { TimeseriesDatumModel } from 'ngx-prx-styleguide';

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
  const ep0Downloads = [
    ['2017-08-27T00:00:00Z', 22],
    ['2017-08-28T00:00:00Z', 90],
    ['2017-08-29T00:00:00Z', 58],
    ['2017-08-30T00:00:00Z', 22],
    ['2017-08-31T00:00:00Z', 90],
    ['2017-09-01T00:00:00Z', 58],
    ['2017-09-02T00:00:00Z', 22],
    ['2017-09-03T00:00:00Z', 90],
    ['2017-09-04T00:00:00Z', 58],
    ['2017-09-05T00:00:00Z', 22],
    ['2017-09-06T00:00:00Z', 90],
    ['2017-09-07T00:00:00Z', 58]
  ];
  const ep1Downloads = [
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
  const episodes: EpisodeModel[] = [
    {
      doc: undefined,
      seriesId: 37800,
      id: 123,
      publishedAt: new Date(),
      title: 'A Pet Talk Episode',
      guid: 'abcdefg'
    },
    {
      doc: undefined,
      seriesId: 37800,
      id: 124,
      publishedAt: new Date(),
      title: 'Another Pet Talk Episode',
      guid: 'gfedcba'
    }
  ];
  const filter: FilterModel = {
    podcastSeriesId: podcast.seriesId,
    episodeIds: episodes.map(e => e.id),
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
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DownloadsChartComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      // call episode and podcast metrics to prime the store
      comp.store.dispatch(new CastleFilterAction({filter}));
      comp.store.dispatch(new CmsAllPodcastEpisodeGuidsAction({podcast, episodes}));
      comp.store.dispatch(new CastleEpisodeMetricsAction({episode: episodes[0], filter, metricsType: 'downloads', metrics: ep0Downloads}));
      comp.store.dispatch(new CastleEpisodeMetricsAction({episode: episodes[1], filter, metricsType: 'downloads', metrics: ep1Downloads}));
      comp.store.dispatch(new CastlePodcastMetricsAction({podcast, filter, metricsType: 'downloads', metrics: podDownloads}));
    });
  }));

  it('should transform podcast and episode data to chart models', () => {
    expect(comp.podcastChartData.data.length).toEqual(podDownloads.length);
    let chartedEpisodes;
    if (getTotal(ep0Downloads) > getTotal(ep1Downloads)) {
      chartedEpisodes = episodes;
    } else {
      chartedEpisodes = [episodes[1], episodes[0]];
    }
    expect(comp.episodeChartData[0].label).toEqual(chartedEpisodes[0].title);
    expect(comp.episodeChartData[1].label).toEqual(chartedEpisodes[1].title);
    expect(comp.chartData.length).toBe(3);
    expect(comp.chartData[comp.chartData.length - 1].label).toEqual('All Other Episodes');
  });

  it('should subtract episode data from podcast data for chart display', () => {
    expect(comp.chartData[comp.chartData.length - 1].data[0].value).toEqual(52522 - (522 + 22));
  });

  it('should only include filtered episode metrics', () => {
    comp.store.dispatch(new CastleFilterAction({filter: {episodeIds: [episodes[0].id]}}));
    expect(comp.episodeChartData.length).toEqual(1);
  });

  it('should sort episode chart data by total biggest to smallest', () => {
    const getTotal = (data: TimeseriesDatumModel[]) => {
      if (data.length > 0) {
        return data.map(d => d.value).reduce((total: number, value: number) => {
          return total + value;
        });
      } else {
        return 0;
      }
    };
    expect(getTotal(comp.episodeChartData[0].data)).toBeGreaterThanOrEqual(getTotal(comp.episodeChartData[1].data));
  });

  it('should show bar chart if there are less than 4 data points; otherwise, area', () => {
    expect(comp.chartType).toEqual('area');
    comp.store.dispatch(new CastleFilterAction({filter: {
      beginDate: new Date('2017-09-05T00:00:00Z'),
      endDate: new Date('2017-09-07T00:00:00Z')
    }}));
    fix.detectChanges();
    expect(comp.chartType).toEqual('bar');
  });
});
