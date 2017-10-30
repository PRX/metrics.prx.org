import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { By } from '@angular/platform-browser';

import { SharedModule } from '../shared';
import { DownloadsTableComponent } from './downloads-table.component';

import { reducers } from '../ngrx/reducers';
import { PodcastModel, EpisodeModel, FilterModel, INTERVAL_DAILY } from '../ngrx/model';
import { CastlePodcastMetricsAction, CastleEpisodeMetricsAction, CastleFilterAction, CmsAllPodcastEpisodeGuidsAction } from '../ngrx/actions';

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
      publishedAt: new Date('9/9/17'),
      title: 'A Pet Talk Episode',
      guid: 'abcdefg'
    },
    {
      doc: undefined,
      seriesId: 37800,
      id: 124,
      publishedAt: new Date(),
      title: 'A More Recent Pet Talk Episode',
      guid: 'gfedcba'
    }
  ];
  const filter: FilterModel = {
    podcast,
    episodes,
    beginDate: new Date('2017-08-27T00:00:00Z'),
    endDate: new Date('2017-09-07T00:00:00Z'),
    interval: INTERVAL_DAILY
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DownloadsTableComponent
      ],
      imports: [
        RouterTestingModule,
        SharedModule,
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DownloadsTableComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      // call episode and episode metrics to prime the store
      comp.store.dispatch(new CastleFilterAction({filter}));
      comp.store.dispatch(new CastleEpisodeMetricsAction({episode: episodes[0], filter, metricsType: 'downloads', metrics: ep0Downloads}));
      comp.store.dispatch(new CastleEpisodeMetricsAction({episode: episodes[1], filter, metricsType: 'downloads', metrics: ep1Downloads}));
      comp.store.dispatch(new CmsAllPodcastEpisodeGuidsAction({podcast, episodes}));
      comp.store.dispatch(new CastlePodcastMetricsAction({podcast, filter, metricsType: 'downloads', metrics: podDownloads}));
    });
  }));

  it('should transform episode and podcast data to table data', () => {
    expect(comp.episodeTableData.length).toEqual(episodes.length);
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

  it('should show only the episodes in filter', () => {
    comp.store.dispatch(new CastleFilterAction({filter: {episodes: [episodes[0]]}}));
    expect(comp.episodeTableData.length).toEqual(1);
  });

  it('should clear out episode table data when podcast changes', () => {
    spyOn(comp, 'resetAllData').and.callThrough();
    const differentPodcast: PodcastModel = {
      doc: undefined,
      seriesId: 37801,
      title: 'Totally Not Pet Talks Daily'
    };
    comp.store.dispatch(new CastleFilterAction({filter: {podcast: differentPodcast}}));
    expect(comp.resetAllData).toHaveBeenCalled();
  });

  it('should display episode total downloads for period', () => {
    comp.episodeTableData.forEach(e => {
      expect(e.totalForPeriod).not.toBeNull();
    });
  });
});
