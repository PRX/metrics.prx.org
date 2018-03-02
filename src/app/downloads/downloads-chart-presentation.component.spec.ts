import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared';
import { DownloadsChartPresentationComponent } from './downloads-chart-presentation.component';

import { reducers } from '../ngrx/reducers';
import { PodcastModel, EpisodeModel, RouterModel, ChartType, MetricsType,
  INTERVAL_DAILY, CHARTTYPE_STACKED, METRICSTYPE_DOWNLOADS, getMetricsProperty } from '../ngrx';
import { CmsPodcastEpisodePageSuccessAction, CastlePodcastMetricsSuccessAction,
  CastleEpisodeMetricsSuccessAction, CustomRouterNavigationAction } from '../ngrx/actions';

import { getTotal } from '../shared/util/metrics.util';
import { TimeseriesDatumModel } from 'ngx-prx-styleguide';

describe('DownloadsChartPresentationComponent', () => {
  let comp: DownloadsChartPresentationComponent;
  let fix: ComponentFixture<DownloadsChartPresentationComponent>;
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
    });
  }));

  it('should show placeholder when no chart data', () => {
    expect(de.query(By.css('.placeholder'))).not.toBeNull();
  });

  describe('stacked podcast and episode chart', () => {
    const podcast: PodcastModel = {
      seriesId: 37800,
      feederId: '70',
      title: 'Pet Talks Daily'
    };
    const episodes: EpisodeModel[] = [
      {
        seriesId: 37800,
        id: 123,
        publishedAt: new Date(),
        title: 'A Pet Talk Episode',
        guid: 'abcdefg',
        page: 1
      },
      {
        seriesId: 37800,
        id: 124,
        publishedAt: new Date(),
        title: 'Another Pet Talk Episode',
        guid: 'gfedcba',
        page: 1
      }
    ];
    const routerState: RouterModel = {
      podcastSeriesId: podcast.seriesId,
      page: 1,
      beginDate: new Date('2017-08-27T00:00:00Z'),
      endDate: new Date('2017-09-07T00:00:00Z'),
      interval: INTERVAL_DAILY,
      chartType: <ChartType>CHARTTYPE_STACKED,
      metricsType: <MetricsType>METRICSTYPE_DOWNLOADS,
      chartPodcast: true,
      episodeIds: [123, 124]
    };
    const metricsPropertyName = getMetricsProperty(routerState.interval, routerState.metricsType);

    beforeEach(() => {
      // call episode and podcast metrics to prime the store
      comp.store.dispatch(new CustomRouterNavigationAction({routerState}));
      comp.store.dispatch(new CmsPodcastEpisodePageSuccessAction({episodes}));
      comp.store.dispatch(new CastleEpisodeMetricsSuccessAction({
        seriesId: episodes[0].seriesId, page: episodes[0].page, id: episodes[0].id, guid: episodes[0].guid,
        metricsPropertyName, metrics: ep0Downloads}));
      comp.store.dispatch(new CastleEpisodeMetricsSuccessAction({
        seriesId: episodes[1].seriesId, page: episodes[1].page, id: episodes[1].id, guid: episodes[1].guid,
        metricsPropertyName, metrics: ep1Downloads}));
      comp.store.dispatch(new CastlePodcastMetricsSuccessAction({
        seriesId: podcast.seriesId, feederId: podcast.feederId, metricsPropertyName, metrics: podDownloads}));
    });

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
      comp.store.dispatch(new CustomRouterNavigationAction({routerState: {page: 2}}));
      expect(comp.episodeChartData.length).toEqual(0);
    });

    it('should only include charted episodes', () => {
      expect(comp.episodeChartData.length).toEqual(2);
      comp.store.dispatch(new CustomRouterNavigationAction({routerState: {...routerState, episodeIds: [episodes[1].id]}}));
      expect(comp.episodeChartData.length).toEqual(1);
    });

    it('should only include podcast and episodes if charted', () => {
      expect(comp.chartData).not.toBeNull();
      expect(comp.chartData).not.toBeNull();
      expect(comp.chartData[0].label).not.toContain('All');
      expect(comp.chartData[0].label).toContain('Pet Talk');
      comp.store.dispatch(new CustomRouterNavigationAction({routerState: {...routerState, chartPodcast: false, episodeIds: undefined}}));
      expect(comp.chartData).toBeNull();
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
      comp.store.dispatch(new CustomRouterNavigationAction({routerState: {
        beginDate: new Date(podDownloads[0][0].toString()),
        endDate: new Date(podDownloads[2][0].toString())
      }}));
      comp.store.dispatch(new CastlePodcastMetricsSuccessAction({
        seriesId: podcast.seriesId, feederId: podcast.feederId, metricsPropertyName, metrics: podDownloads.slice(0, 3)}));
      comp.store.dispatch(new CastleEpisodeMetricsSuccessAction({
        seriesId: episodes[1].seriesId, page: episodes[1].page, id: episodes[1].id, guid: episodes[1].guid,
        metricsPropertyName, metrics: ep1Downloads.slice(0, 3)}));
      comp.store.dispatch(new CastleEpisodeMetricsSuccessAction({
        seriesId: episodes[1].seriesId, page: episodes[1].page, id: episodes[1].id, guid: episodes[1].guid,
        metricsPropertyName, metrics: ep1Downloads.slice(0, 3)}));
      fix.detectChanges();
      expect(comp.chartType).toEqual('bar');
    });
  });

  describe('single line podcast chart', () => {
    const podcast: PodcastModel = {
      seriesId: 37800,
      feederId: '70',
      title: 'Pet Talks Daily'
    };
    const routerState: RouterModel = {
      podcastSeriesId: podcast.seriesId,
      page: 1,
      beginDate: new Date('2017-08-27T00:00:00Z'),
      endDate: new Date('2017-09-07T00:00:00Z'),
      interval: INTERVAL_DAILY,
      chartType: 'podcast',
      metricsType: <MetricsType>METRICSTYPE_DOWNLOADS,
      chartPodcast: true
    };
    const metricsPropertyName = getMetricsProperty(routerState.interval, routerState.metricsType);

    beforeEach(() => {
      // call episode and podcast metrics to prime the store
      comp.store.dispatch(new CustomRouterNavigationAction({routerState}));
      comp.store.dispatch(new CastlePodcastMetricsSuccessAction({
        seriesId: podcast.seriesId,
        feederId: podcast.feederId,
        metricsPropertyName,
        metrics: podDownloads
      }));
    });

    it('should transform podcast data to chart model', () => {
      expect(comp.podcastChartData.data.length).toEqual(podDownloads.length);
      expect(comp.chartData.length).toBe(1);
      expect(comp.chartData[comp.chartData.length - 1].label).toEqual('All Episodes');
    });

    it('should include podcast data as is for chart display', () => {
      expect(comp.chartData[comp.chartData.length - 1].data[0].value).toEqual(52522);
    });

    it('should include podcast regardless of whether or not it is set to charted', () => {
      expect(comp.chartData).not.toBeNull();
      expect(comp.chartData).not.toBeNull();
      expect(comp.chartData[0].label).toContain('All Episodes');
    });
  });

  describe('multi-line episode chart', () => {
    const episodes: EpisodeModel[] = [
      {
        seriesId: 37800,
        id: 123,
        publishedAt: new Date(),
        title: 'A Pet Talk Episode',
        guid: 'abcdefg',
        page: 1
      },
      {
        seriesId: 37800,
        id: 124,
        publishedAt: new Date(),
        title: 'Another Pet Talk Episode',
        guid: 'gfedcba',
        page: 1
      }
    ];
    const routerState: RouterModel = {
      podcastSeriesId: episodes[0].seriesId,
      page: 1,
      beginDate: new Date('2017-08-27T00:00:00Z'),
      endDate: new Date('2017-09-07T00:00:00Z'),
      interval: INTERVAL_DAILY,
      chartType: <ChartType>CHARTTYPE_STACKED,
      metricsType: <MetricsType>METRICSTYPE_DOWNLOADS,
      chartPodcast: true,
      episodeIds: [123, 124]
    };
    const metricsPropertyName = getMetricsProperty(routerState.interval, routerState.metricsType);

    beforeEach(() => {
      // call episode and podcast metrics to prime the store
      comp.store.dispatch(new CustomRouterNavigationAction({routerState}));
      comp.store.dispatch(new CmsPodcastEpisodePageSuccessAction({episodes}));
      comp.store.dispatch(new CastleEpisodeMetricsSuccessAction({
        seriesId: episodes[0].seriesId, page: episodes[0].page, id: episodes[0].id, guid: episodes[0].guid,
        metricsPropertyName, metrics: ep0Downloads}));
      comp.store.dispatch(new CastleEpisodeMetricsSuccessAction({
        seriesId: episodes[1].seriesId, page: episodes[1].page, id: episodes[1].id, guid: episodes[1].guid,
        metricsPropertyName, metrics: ep1Downloads}));
    });

    it('should transform episode data to chart model', () => {
      let chartedEpisodes;
      if (getTotal(ep0Downloads) > getTotal(ep1Downloads)) {
        chartedEpisodes = episodes;
      } else {
        chartedEpisodes = [episodes[1], episodes[0]];
      }
      expect(comp.episodeChartData[0].label).toEqual(chartedEpisodes[0].title);
      expect(comp.episodeChartData[1].label).toEqual(chartedEpisodes[1].title);
      expect(comp.chartData.length).toBe(2);
      expect(comp.chartData[0].label).toEqual(chartedEpisodes[0].title);
    });

    it('should only include filtered episode metrics', () => {
      comp.store.dispatch(new CustomRouterNavigationAction({routerState: {page: 2}}));
      expect(comp.episodeChartData.length).toEqual(0);
    });

    it('should only include charted episodes', () => {
      expect(comp.episodeChartData.length).toEqual(2);
      comp.store.dispatch(new CustomRouterNavigationAction({routerState: {...routerState, episodeIds: [episodes[1].id]}}));
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
  });
});
