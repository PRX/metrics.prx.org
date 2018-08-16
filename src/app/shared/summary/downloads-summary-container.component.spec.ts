import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';

import { reducers, RootState } from '../../ngrx/reducers';

import { CustomRouterNavigationAction, CastlePodcastMetricsSuccessAction } from '../../ngrx/actions';
import { RouterParams, INTERVAL_DAILY, MetricsType, METRICSTYPE_DOWNLOADS, getMetricsProperty } from '../../ngrx';

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
    id: '70',
    title: 'Pet Talks Daily',
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
  const routerParams: RouterParams = {
    podcastId: podcast.id,
    metricsType: <MetricsType>METRICSTYPE_DOWNLOADS,
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

      const metricsPropertyName = getMetricsProperty(routerParams.interval, routerParams.metricsType);
      store.dispatch(new CustomRouterNavigationAction({routerParams}));
      store.dispatch(new CastlePodcastMetricsSuccessAction({
        id: podcast.id, metricsPropertyName, metrics: podDownloads}));
    });
  }));

  it('should have total downloads filtered by to date range', () => {
    let result;
    comp.total$.subscribe(value => result = value);
    expect(result).toEqual(metricsUtil.getTotal(podDownloads));
  });
});
