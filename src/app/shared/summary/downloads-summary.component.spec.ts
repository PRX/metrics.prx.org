import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';

import { reducers, RootState } from '../../ngrx/reducers';
import { CustomRouterNavigation, CastlePodcastDownloadsSuccess } from '../../ngrx/actions';
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
      declarations: [DownloadsSummaryComponent, LargeNumberPipe],
      imports: [StoreModule.forRoot(reducers)]
    })
      .compileComponents()
      .then(() => {
        fix = TestBed.createComponent(DownloadsSummaryComponent);
        comp = fix.componentInstance;
        de = fix.debugElement;
        el = de.nativeElement;
        store = TestBed.inject(Store);

        store.dispatch(CustomRouterNavigation({ routerParams }));
        store.dispatch(CastlePodcastDownloadsSuccess({ id: podcast.id, downloads: podDownloads }));
        fix.detectChanges();
      });
  }));

  it('should show total value', () => {
    const pipe = new LargeNumberPipe();
    expect(de.query(By.css('.value')).nativeElement.textContent).toEqual(pipe.transform(metricsUtil.getTotal(podDownloads)));
  });
});
