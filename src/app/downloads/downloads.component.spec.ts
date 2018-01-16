import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Angulartics2 } from 'angulartics2';

import { MockHalService, MockHalDoc, AuthModule, FancyFormModule } from 'ngx-prx-styleguide';
import { CoreModule, CastleService } from '../core';
import { SharedModule } from '../shared';
import { DownloadsComponent } from './downloads.component';
import { DownloadsChartComponent } from './downloads-chart.component';
import { DownloadsTableComponent } from './downloads-table.component';
import { downloadsRouting } from './downloads.routing';

import { reducers } from '../ngrx/reducers';
import { CastleFilterAction, CmsPodcastsSuccessAction, CmsPodcastEpisodePageSuccessAction,
  CastlePodcastMetricsAction, CastleEpisodeMetricsAction} from '../ngrx/actions';

describe('DownloadsComponent', () => {
  let comp: DownloadsComponent;
  let fix: ComponentFixture<DownloadsComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let castle;

  const podcast = {
    seriesId: 37800,
    feederId: '70',
    title: 'Pet Talks Daily'
  };
  podcast['doc'] = new MockHalDoc(podcast);
  const downloads = [
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

  beforeEach(async(() => {
    castle = new MockHalService();
    castle.root.mockList('prx:podcast-downloads', [{downloads}]);
    castle.root.mockList('prx:episode-downloads', [{downloads}]);

    TestBed.configureTestingModule({
      declarations: [
        DownloadsComponent,
        DownloadsChartComponent,
        DownloadsTableComponent
      ],
      imports: [
        CoreModule,
        RouterTestingModule,
        downloadsRouting,
        SharedModule,
        AuthModule,
        FancyFormModule,
        StoreModule.forRoot(reducers)
      ],
      providers: [
        {provide: CastleService, useValue: castle.root},
        {provide: Angulartics2, useValue: {
          eventTrack: new Subject<any>()
        }}
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DownloadsComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      spyOn(comp, 'setPodcastMetrics').and.callThrough();
      spyOn(comp, 'setEpisodeMetrics').and.callThrough();
      spyOn(comp.store, 'dispatch').and.callThrough();
    });
  }));

  it('should show loading spinner when episode or podcast is loading', () => {
    comp.isPodcastLoading = true;
    expect(de.query(By.css('prx-spinner'))).not.toBeNull();
    comp.isPodcastLoading = comp.isEpisodeLoading = false;
    fix.detectChanges();
    expect(de.query(By.css('prx-spinner'))).toBeFalsy();
  });

  describe('after loading podcasts...', () => {
    beforeEach(() => {
      spyOn(comp, 'googleAnalyticsEvent').and.callThrough();
      comp.store.dispatch(new CastleFilterAction({
        filter: {podcastSeriesId: 37800, page: 1}
      }));
      comp.store.dispatch(new CmsPodcastsSuccessAction({podcasts: [podcast]}));
    });


    it('should load podcast downloads and dispatch CASTLE action', () => {
      expect(comp.setPodcastMetrics).toHaveBeenCalled();
      expect(comp.store.dispatch).toHaveBeenCalled();
    });

    it('should load episode downloads and call CASTLE action', () => {
      comp.store.dispatch(new CastleFilterAction({filter: {page: 1}}));
      comp.store.dispatch(new CmsPodcastEpisodePageSuccessAction({episodes:
        [{
          id: 123,
          seriesId: 37800,
          title: 'A New Pet Talk Episode',
          publishedAt: new Date(),
          guid: 'abcdefg',
          page: 1
        }]
      }));
      expect(comp.setEpisodeMetrics).toHaveBeenCalled();
      expect(comp.store.dispatch).toHaveBeenCalled();
    });

    it('should reload podcast and episode data if filter parameters change', () => {
      const beginDate = new Date();
      comp.store.dispatch(new CastleFilterAction({filter: {page: 1}}));
      comp.store.dispatch(new CmsPodcastEpisodePageSuccessAction({episodes:
        [{
          id: 123,
          seriesId: 37800,
          title: 'A New Pet Talk Episode',
          publishedAt: new Date(),
          guid: 'abcdefg',
          page: 1
        }]
      }));
      comp.store.dispatch(new CastleFilterAction({filter: {beginDate}}));
      expect(comp.setPodcastMetrics).toHaveBeenCalledTimes(2);
      expect(comp.setEpisodeMetrics).toHaveBeenCalledTimes(2);
      expect(comp.googleAnalyticsEvent).toHaveBeenCalledTimes(2);
      expect(comp.store.dispatch).toHaveBeenCalledWith(jasmine.any(CastlePodcastMetricsAction));
      expect(comp.store.dispatch).toHaveBeenCalledWith(jasmine.any(CastleEpisodeMetricsAction));
    });

    it('should show a downloads table of episodes', () => {
      comp.podcasts = [podcast];
      fix.detectChanges();
      expect(de.query(By.css('metrics-downloads-table'))).not.toBeNull();
    });
  });
});
