import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared';
import { DownloadsTableComponent } from './downloads-table.component';

import { reducers } from '../ngrx/reducers';
// import { PodcastModel, EpisodeModel, FilterModel, INTERVAL_DAILY } from '../ngrx/model';
// import { CastlePodcastMetricsAction, CastleEpisodeMetricsAction, CastleFilterAction } from '../ngrx/actions';

// import { getTotal } from '../shared/util/metrics.util';
// import { TimeseriesDatumModel } from 'ngx-prx-styleguide';

describe('DownloadsTableComponent', () => {
  let comp: DownloadsTableComponent;
  let fix: ComponentFixture<DownloadsTableComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  // const podDownloads = [
  //   ['2017-08-27T00:00:00Z', 52522],
  //   ['2017-08-28T00:00:00Z', 162900],
  //   ['2017-08-29T00:00:00Z', 46858],
  //   ['2017-08-30T00:00:00Z', 52522],
  //   ['2017-08-31T00:00:00Z', 162900],
  //   ['2017-09-01T00:00:00Z', 46858],
  //   ['2017-09-02T00:00:00Z', 52522],
  //   ['2017-09-03T00:00:00Z', 162900],
  //   ['2017-09-04T00:00:00Z', 46858],
  //   ['2017-09-05T00:00:00Z', 52522],
  //   ['2017-09-06T00:00:00Z', 162900],
  //   ['2017-09-07T00:00:00Z', 46858]
  // ];
  // const ep0Downloads = [
  //   ['2017-08-27T00:00:00Z', 22],
  //   ['2017-08-28T00:00:00Z', 90],
  //   ['2017-08-29T00:00:00Z', 58],
  //   ['2017-08-30T00:00:00Z', 22],
  //   ['2017-08-31T00:00:00Z', 90],
  //   ['2017-09-01T00:00:00Z', 58],
  //   ['2017-09-02T00:00:00Z', 22],
  //   ['2017-09-03T00:00:00Z', 90],
  //   ['2017-09-04T00:00:00Z', 58],
  //   ['2017-09-05T00:00:00Z', 22],
  //   ['2017-09-06T00:00:00Z', 90],
  //   ['2017-09-07T00:00:00Z', 58]
  // ];
  // const ep1Downloads = [
  //   ['2017-08-27T00:00:00Z', 522],
  //   ['2017-08-28T00:00:00Z', 900],
  //   ['2017-08-29T00:00:00Z', 858],
  //   ['2017-08-30T00:00:00Z', 522],
  //   ['2017-08-31T00:00:00Z', 900],
  //   ['2017-09-01T00:00:00Z', 858],
  //   ['2017-09-02T00:00:00Z', 522],
  //   ['2017-09-03T00:00:00Z', 900],
  //   ['2017-09-04T00:00:00Z', 858],
  //   ['2017-09-05T00:00:00Z', 522],
  //   ['2017-09-06T00:00:00Z', 900],
  //   ['2017-09-07T00:00:00Z', 858]
  // ];
  // const podcast: PodcastModel = {
  //   doc: undefined,
  //   seriesId: 37800,
  //   feederId: '70',
  //   title: 'Pet Talks Daily'
  // };
  // const episodes: EpisodeModel[] = [
  //   {
  //     doc: undefined,
  //     seriesId: 37800,
  //     id: 123,
  //     publishedAt: new Date(),
  //     title: 'A Pet Talk Episode',
  //     guid: 'abcdefg'
  //   },
  //   {
  //     doc: undefined,
  //     seriesId: 37800,
  //     id: 124,
  //     publishedAt: new Date(),
  //     title: 'Another Pet Talk Episode',
  //     guid: 'gfedcba'
  //   }
  // ];
  // const filter: FilterModel = {
  //   podcast,
  //   episodes,
  //   beginDate: new Date('2017-08-27T00:00:00Z'),
  //   endDate: new Date('2017-09-07T00:00:00Z'),
  //   interval: INTERVAL_DAILY
  // };

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

      // call episode and podcast metrics to prime the store
      // comp.store.dispatch(new CastleFilterAction({filter}));
      // comp.store.dispatch(new CastleEpisodeMetricsAction({episode: episodes[0], filter, metricsType: 'downloads', metrics: ep0Downloads}));
      // comp.store.dispatch(new CastleEpisodeMetricsAction({episode: episodes[1], filter, metricsType: 'downloads', metrics: ep1Downloads}));
      // comp.store.dispatch(new CastlePodcastMetricsAction({podcast, filter, metricsType: 'downloads', metrics: podDownloads}));
    });
  }));

  it('should show on page', () => {
    expect(de.query(By.css('h1'))).not.toBeNull();
  });
});
