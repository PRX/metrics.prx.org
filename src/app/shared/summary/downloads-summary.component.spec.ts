import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';

import { reducers, RootState } from '../../ngrx/reducers';
import { CustomRouterNavigationAction, CastlePodcastDownloadsSuccessAction } from '../../ngrx/actions';
import { getMetricsProperty } from '../../ngrx';
import * as metricsUtil from '../util/metrics.util';
import { routerParams, podcast, podDownloads } from '../../../testing/downloads.fixtures';

import { DownloadsSummaryComponent } from './downloads-summary.component';
import { LargeNumberPipe } from '../pipes/large-number.pipe';

describe('DownloadsSummaryComponent', () => {
  let store: Store<RootState>;
  let comp: DownloadsSummaryComponent;
  let fix: ComponentFixture<DownloadsSummaryComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DownloadsSummaryComponent,
        LargeNumberPipe
      ],
      imports: [
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DownloadsSummaryComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;
      store = TestBed.get(Store);

      const metricsPropertyName = getMetricsProperty(routerParams.interval, routerParams.metricsType);
      store.dispatch(new CustomRouterNavigationAction({routerParams}));
      store.dispatch(new CastlePodcastDownloadsSuccessAction({
        id: podcast.id, metricsPropertyName, metrics: podDownloads}));
      fix.detectChanges();
    });
  }));

  it('should show total value', () => {
    const pipe = new LargeNumberPipe();
    expect(de.query(By.css('.value')).nativeElement.innerText).toEqual(pipe.transform(metricsUtil.getTotal(podDownloads)));
  });
});
