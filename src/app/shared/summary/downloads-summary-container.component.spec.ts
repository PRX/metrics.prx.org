import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';

import { reducers, RootState } from '../../ngrx/reducers';

import { CastleFilterAction, CastlePodcastMetricsAction } from '../../ngrx/actions';
import { FilterModel, INTERVAL_DAILY } from '../../ngrx';

import * as metricsUtil from '../util/metrics.util';

import { DownloadsSummaryContainerComponent } from './downloads-summary-container.component';
import { DownloadsSummaryItemComponent } from './downloads-summary-item.component';
import { LargeNumberPipe } from '../pipes/large-number.pipe';

describe('DownloadsSummaryContainerComponent', () => {
  let store: Store<RootState>;
  let comp: DownloadsSummaryContainerComponent;
  let fix: ComponentFixture<DownloadsSummaryContainerComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const podcast = {
    seriesId: 37800,
    title: 'Pet Talks Daily',
    feederId: '70'
  };
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
  const filter: FilterModel = {
    podcastSeriesId: podcast.seriesId,
    interval: INTERVAL_DAILY,
    beginDate: new Date('2017-08-27T00:00:00Z'),
    endDate: new Date('2017-09-07T00:00:00Z')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DownloadsSummaryContainerComponent,
        DownloadsSummaryItemComponent,
        LargeNumberPipe
      ],
      imports: [
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DownloadsSummaryContainerComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      store = TestBed.get(Store);

      store.dispatch(new CastleFilterAction({filter}));
      store.dispatch(new CastlePodcastMetricsAction({podcast, filter, metricsType: 'downloads', metrics: podDownloads}));
    });
  }));

  it('should have total downloads filtered by to date range', () => {
    let result;
    comp.total$.subscribe(value => result = value);
    expect(result).toEqual(metricsUtil.getTotal(podDownloads));
  });

  it('should have average downloads according to interval filtered by date range ', () => {
    let result;
    comp.average$.subscribe(value => result = value);
    expect(result).toEqual(metricsUtil.getTotal(podDownloads) / podDownloads.length);
  });

  it('should label average according to interval', () => {
    let result;
    comp.averageLabel$.subscribe(value => result = value);
    expect(result).toEqual('average / day');
  });
});