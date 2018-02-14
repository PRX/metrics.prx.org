import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { FancyFormModule } from 'ngx-prx-styleguide';

import { SharedModule } from '../shared';
import { DownloadsTableComponent } from './downloads-table.component';

import { reducers } from '../ngrx/reducers';
import { PodcastModel, EpisodeModel, RouterModel, ChartType, MetricsType,
  CHARTTYPE_STACKED, CHARTTYPE_EPISODES, INTERVAL_DAILY, INTERVAL_HOURLY, METRICSTYPE_DOWNLOADS, getMetricsProperty } from '../ngrx';
import * as ACTIONS from '../ngrx/actions';

describe('DownloadsTableComponent', () => {
  let comp: DownloadsTableComponent;
  let fix: ComponentFixture<DownloadsTableComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;

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
  const podHourlyDownloads = [
    ['2017-09-07T00:00:00Z', 52522],
    ['2017-09-07T01:00:00Z', 162900],
    ['2017-09-07T02:00:00Z', 46858],
    ['2017-09-07T03:00:00Z', 52522],
    ['2017-09-07T04:00:00Z', 162900],
    ['2017-09-07T05:00:00Z', 46858],
    ['2017-09-07T06:00:00Z', 52522],
    ['2017-09-07T07:00:00Z', 162900],
    ['2017-09-07T08:00:00Z', 46858],
    ['2017-09-07T09:00:00Z', 52522],
    ['2017-09-07T10:00:00Z', 162900],
    ['2017-09-07T11:00:00Z', 46858],
    ['2017-09-07T12:00:00Z', 52522],
    ['2017-09-07T13:00:00Z', 162900],
    ['2017-09-07T14:00:00Z', 46858],
    ['2017-09-07T15:00:00Z', 52522],
    ['2017-09-07T16:00:00Z', 162900],
    ['2017-09-07T17:00:00Z', 46858],
    ['2017-09-07T18:00:00Z', 52522],
    ['2017-09-07T19:00:00Z', 162900],
    ['2017-09-07T20:00:00Z', 46858],
    ['2017-09-07T21:00:00Z', 52522],
    ['2017-09-07T22:00:00Z', 162900],
    ['2017-09-07T23:00:00Z', 46858]
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
    seriesId: 37800,
    feederId: '70',
    title: 'Pet Talks Daily'
  };
  const episodes: EpisodeModel[] = [
    {
      seriesId: 37800,
      id: 123,
      publishedAt: new Date('9/9/17'),
      title: 'A Pet Talk Episode',
      guid: 'abcdefg',
      page: 1,
      color: '#ff0000'
    },
    {
      seriesId: 37800,
      id: 124,
      publishedAt: new Date(),
      title: 'A More Recent Pet Talk Episode',
      guid: 'gfedcba',
      page: 1,
      color: '#00ff00'
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
  };
  const metricsPropertyName = getMetricsProperty(routerState.interval, routerState.metricsType);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DownloadsTableComponent
      ],
      imports: [
        RouterTestingModule,
        SharedModule,
        FancyFormModule,
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DownloadsTableComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
      store = TestBed.get(Store);

      // call episode and episode metrics to prime the store
      store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerState}));
      store.dispatch(new ACTIONS.CastleEpisodeMetricsSuccessAction({
        seriesId: episodes[0].seriesId, page: episodes[0].page, id: episodes[0].id, guid: episodes[0].guid,
        metricsPropertyName, metrics: ep0Downloads}));
      store.dispatch(new ACTIONS.CastleEpisodeMetricsSuccessAction({
        seriesId: episodes[1].seriesId, page: episodes[1].page, id: episodes[1].id, guid: episodes[1].guid,
        metricsPropertyName, metrics: ep1Downloads}));
      store.dispatch(new ACTIONS.CmsPodcastEpisodePageSuccessAction({episodes}));
      store.dispatch(new ACTIONS.CastlePodcastMetricsSuccessAction({
        seriesId: podcast.seriesId, feederId: podcast.feederId, metricsPropertyName, metrics: podDownloads}));

      spyOn(store, 'dispatch').and.callThrough();
    });
  }));

  it('should transform episode and podcast data to table data', () => {
    expect(comp.episodeTableData.length).toEqual(episodes.filter(e => e.page === routerState.page).length);
    expect(comp.episodeTableData[0].totalForPeriod).not.toBeNull();
    expect(comp.podcastTableData['title']).toEqual('All Episodes');
    expect(comp.podcastTableData['totalForPeriod']).not.toBeNull();
  });

  it('should sort episodes by published date', () => {
    expect(comp.episodeTableData[0].title).toEqual('A More Recent Pet Talk Episode');
  });

  it('should not show up without data to display', () => {
    fix.detectChanges();
    expect(de.query(By.css('table'))).not.toBeNull();

    comp.podcastTableData = null;
    fix.detectChanges();
    expect(de.query(By.css('table'))).toBeNull();
  });

  it('should show only the episodes in route', () => {
    const episode = {
      seriesId: 37800,
      id: 120,
      publishedAt: new Date('1/1/17'),
      title: 'An Older Pet Talk Episode',
      guid: 'aaa',
      page: 2
    };
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerState: {page: 2}}));
    store.dispatch(new ACTIONS.CmsPodcastEpisodePageSuccessAction({episodes: [episode]}));
    store.dispatch(new ACTIONS.CastleEpisodeMetricsSuccessAction({
      seriesId: episode.seriesId, page: episode.page, id: episode.id, guid: episode.guid, metricsPropertyName, metrics: ep0Downloads}));
    expect(comp.episodeTableData.length).toEqual(1);
  });

  it('should clear out episode table data when podcast changes', () => {
    spyOn(comp, 'resetAllData').and.callThrough();
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerState: {podcastSeriesId: 37801}}));
    expect(comp.resetAllData).toHaveBeenCalled();
  });

  it('should display episode total downloads for period', () => {
    comp.episodeTableData.forEach(e => {
      expect(e.totalForPeriod).not.toBeNull();
    });
  });

  it('should display podcast all time total downloads', () => {
    const { seriesId, feederId } = podcast;
    store.dispatch(new ACTIONS.CastlePodcastPerformanceMetricsSuccessAction({ seriesId, feederId,
      total: 10, previous7days: 5, this7days: 5, yesterday: 1, today: 1 }));
    expect(comp.podcastTableData['allTimeDownloads']).toEqual(10);
  });

  it('should display episode all time total downloads', () => {
    {
      const {id, seriesId, guid} = episodes[1];
      store.dispatch(new ACTIONS.CastleEpisodePerformanceMetricsSuccessAction({id, seriesId, guid,
        total: 5, previous7days: 0, this7days: 5, yesterday: 1, today: 1}));
    }
    {
      const {id, seriesId, guid} = episodes[0];
      store.dispatch(new ACTIONS.CastleEpisodePerformanceMetricsSuccessAction({id, seriesId, guid,
        total: 5, previous7days: 0, this7days: 5, yesterday: 1, today: 1}));
    }
    comp.episodeTableData.forEach(e => {
      expect(e.allTimeDownloads).toEqual(5);
    });
  });

  it('should show message about local timezone translation for hourly data', () => {
    const newRouterState = {
      metricsType: <MetricsType>METRICSTYPE_DOWNLOADS,
      interval: INTERVAL_HOURLY,
      beginDate: new Date('2017-09-07T00:00:00Z'),
      endDate: new Date('2017-09-07T23:00:00Z')
    };
    const property = getMetricsProperty(newRouterState.interval, newRouterState.metricsType);
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerState: newRouterState}));
    store.dispatch(new ACTIONS.CastlePodcastMetricsSuccessAction({
      seriesId: podcast.seriesId, feederId: podcast.feederId, metricsPropertyName: property, metrics: podHourlyDownloads}));
    fix.detectChanges();
    expect(de.query(By.css('em')).nativeElement.textContent).toContain('local timezone');
  });

  it('toggles episode display when checkbox is clicked', () => {
    fix.detectChanges();
    const checks = de.queryAll(By.css('input[type="checkbox"]'));
    expect(checks.length).toEqual(3);
    checks[2].nativeElement.click();
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.RouteToggleEpisodeChartedAction({episodeId: 123, charted: true}));
  });

  it('should dispatch routing action on podcast chart toggle', () => {
    comp.toggleChartPodcast(false);
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.RoutePodcastChartedAction({chartPodcast: false}));
  });

  it('should dispatch routing action on episode chart toggle', () => {
    comp.toggleChartEpisode(episodes[0], false);
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.RouteToggleEpisodeChartedAction({episodeId: 123, charted: false}));
  });

  it('should dispatch routing action on chart single episode', () => {
    comp.onChartSingleEpisode(episodes[1]);
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.RouteSingleEpisodeChartedAction(
      {episodeId: 124, chartType: CHARTTYPE_EPISODES}));
  });

  it('should dispatch routing action on page change', () => {
    comp.onPageChange(2);
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.RouteEpisodePageAction({page: 2}));
  });
});
