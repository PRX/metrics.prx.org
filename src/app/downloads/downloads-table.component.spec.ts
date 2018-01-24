import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { FancyFormModule } from 'ngx-prx-styleguide';

import { SharedModule } from '../shared';
import { DownloadsTableComponent } from './downloads-table.component';

import { reducers } from '../ngrx/reducers';
import { PodcastModel, EpisodeModel, RouterModel, ChartType, MetricsType,
  CHARTTYPE_STACKED, INTERVAL_DAILY, INTERVAL_HOURLY, METRICSTYPE_DOWNLOADS, getMetricsProperty } from '../ngrx';
import { CastlePodcastMetricsAction, CastleEpisodeMetricsAction,
  CustomRouterNavigationAction, CmsPodcastEpisodePageSuccessAction,
  CastlePodcastAllTimeMetricsSuccessAction, CastleEpisodeAllTimeMetricsSuccessAction } from '../ngrx/actions';

describe('DownloadsTableComponent', () => {
  let comp: DownloadsTableComponent;
  let fix: ComponentFixture<DownloadsTableComponent>;
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

      // call episode and episode metrics to prime the store
      comp.store.dispatch(new CustomRouterNavigationAction({routerState}));
      comp.store.dispatch(new CastleEpisodeMetricsAction({episode: episodes[0], metricsPropertyName, metrics: ep0Downloads}));
      comp.store.dispatch(new CastleEpisodeMetricsAction({episode: episodes[1], metricsPropertyName, metrics: ep1Downloads}));
      comp.store.dispatch(new CmsPodcastEpisodePageSuccessAction({episodes}));
      comp.store.dispatch(new CastlePodcastMetricsAction({podcast, metricsPropertyName, metrics: podDownloads}));
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
    comp.store.dispatch(new CustomRouterNavigationAction({routerState: {page: 2}}));
    comp.store.dispatch(new CmsPodcastEpisodePageSuccessAction({episodes: [episode]}));
    comp.store.dispatch(new CastleEpisodeMetricsAction({episode: episode, metricsPropertyName, metrics: ep0Downloads}));
    expect(comp.episodeTableData.length).toEqual(1);
  });

  it('should clear out episode table data when podcast changes', () => {
    spyOn(comp, 'resetAllData').and.callThrough();
    comp.store.dispatch(new CustomRouterNavigationAction({routerState: {podcastSeriesId: 37801}}));
    expect(comp.resetAllData).toHaveBeenCalled();
  });

  it('should display episode total downloads for period', () => {
    comp.episodeTableData.forEach(e => {
      expect(e.totalForPeriod).not.toBeNull();
    });
  });

  it('should display podcast all time total downloads', () => {
    comp.store.dispatch(new CastlePodcastAllTimeMetricsSuccessAction({ podcast, allTimeDownloads: 10 }));
    expect(comp.podcastTableData['allTimeDownloads']).toEqual(10);
  });

  it('should display episode all time total downloads', () => {
    comp.store.dispatch(new CastleEpisodeAllTimeMetricsSuccessAction({episode: episodes[1], allTimeDownloads: 5}));
    comp.store.dispatch(new CastleEpisodeAllTimeMetricsSuccessAction({episode: episodes[0], allTimeDownloads: 5}));
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
    comp.store.dispatch(new CustomRouterNavigationAction({routerState: newRouterState}));
    comp.store.dispatch(new CastlePodcastMetricsAction({podcast, metricsPropertyName: property, metrics: podHourlyDownloads}));
    fix.detectChanges();
    expect(de.query(By.css('em')).nativeElement.textContent).toContain('local timezone');
  });

  it('toggles episode display when checkbox is clicked', () => {
    spyOn(comp.episodeChartToggle, 'emit');
    fix.detectChanges();
    const checks = de.queryAll(By.css('input[type="checkbox"]'));
    expect(checks.length).toEqual(3);
    checks[2].nativeElement.click();
    expect(comp.episodeChartToggle.emit).toHaveBeenCalledWith({id: 123, charted: true});
  });
});
