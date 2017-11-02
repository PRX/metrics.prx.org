import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Angulartics2 } from 'angulartics2';

import { MockHalService } from 'ngx-prx-styleguide';
import { CoreModule, CastleService } from '../core';
import { SharedModule } from '../shared';
import { DownloadsComponent } from './downloads.component';
import { DownloadsChartComponent } from './downloads-chart.component';
import { DownloadsTableComponent } from './downloads-table.component';

import { reducers } from '../ngrx/reducers';

import { EpisodeModel } from '../ngrx/model';
import { CastleFilterAction, CmsPodcastsSuccessAction, CmsAllPodcastEpisodeGuidsAction } from '../ngrx/actions';

describe('DownloadsComponent', () => {
  let comp: DownloadsComponent;
  let fix: ComponentFixture<DownloadsComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let castle;

  const podcast = {
    doc: undefined,
    seriesId: 37800,
    feederId: '70',
    title: 'Pet Talks Daily'
  };
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
        SharedModule,
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

  it('should not show filter if app is loading for the first time', () => {
    expect(de.query(By.css('metrics-filter'))).toBeFalsy();
    comp.store.dispatch(new CmsPodcastsSuccessAction({podcasts: [podcast]}));
    fix.detectChanges();
    expect(de.query(By.css('metrics-filter'))).not.toBeNull();
  });

  it('should show loading spinner when episode or podcast is loading', () => {
    comp.isPodcastLoading = true;
    expect(de.query(By.css('prx-spinner'))).not.toBeNull();
    comp.isPodcastLoading = comp.isEpisodeLoading = false;
    fix.detectChanges();
    expect(de.query(By.css('prx-spinner'))).toBeFalsy();
  });

  it('should load podcast downloads and dispatch CASTLE action', () => {
    comp.store.dispatch(new CmsPodcastsSuccessAction({podcasts: [podcast]}));
    comp.store.dispatch(new CastleFilterAction({
      filter: {podcastSeriesId: 37800}
    }));
    expect(comp.setPodcastMetrics).toHaveBeenCalled();
    expect(comp.store.dispatch).toHaveBeenCalled();
  });

  it('should load episode downloads and call CASTLE action', () => {
    comp.store.dispatch(new CastleFilterAction({
      filter: {episodes: [{doc: undefined, id: 123, seriesId: 37800, title: 'A New Pet Talk Episode', publishedAt: new Date()}]}}));
    expect(comp.setEpisodeMetrics).toHaveBeenCalled();
    expect(comp.store.dispatch).toHaveBeenCalled();
  });

  it ('should reload podcast and episode data if filter parameters change', () => {
    const beginDate = new Date(comp.filter.beginDate.valueOf() + 24 * 60 * 60 * 1000);
    comp.store.dispatch(new CmsPodcastsSuccessAction({podcasts: [podcast]}));
    comp.store.dispatch(new CastleFilterAction({
      filter: {podcastSeriesId: 37800}}));
    comp.store.dispatch(new CastleFilterAction({
      filter: {episodes: [{doc: undefined, id: 123, seriesId: 37800, title: 'A New Pet Talk Episode', publishedAt: new Date()}]}}));
    comp.store.dispatch(new CastleFilterAction({filter: {beginDate}}));
    expect(comp.setPodcastMetrics).toHaveBeenCalledTimes(3); // now also called for changes to episodes filter
    expect(comp.setEpisodeMetrics).toHaveBeenCalledTimes(2);
    expect(comp.store.dispatch).toHaveBeenCalledTimes(9);
  });

  it('should reload episode metrics if removed from filter then re-added', () => {
    const episodes = [
      {doc: undefined, id: 123, seriesId: 37800, title: 'A New Pet Talk Episode', publishedAt: new Date()},
      {doc: undefined, id: 1234, seriesId: 37800, title: 'A New Pet Talk Episode', publishedAt: new Date()}
    ];
    comp.store.dispatch(new CastleFilterAction({filter: {episodes}}));
    expect(comp.setEpisodeMetrics).toHaveBeenCalledTimes(2); // once for each episode
    comp.store.dispatch(new CastleFilterAction({filter: {episodes: [episodes[0]]}}));
    expect(comp.setEpisodeMetrics).toHaveBeenCalledTimes(3);
    comp.store.dispatch(new CastleFilterAction({filter: {episodes}}));
    expect(comp.setEpisodeMetrics).toHaveBeenCalledTimes(5);
  });

  it('should show a downloads table of episodes', () => {
    expect(de.query(By.css('metrics-downloads-table'))).not.toBeNull();
  });

  it('should limit the default episode filter to no more than the DONT_BREAK_CASTLE_LIMIT', () => {
    comp.store.dispatch(new CastleFilterAction({
      filter: {podcastSeriesId: 37800}}));
    const episodes: EpisodeModel[] = [];
    for (let i = 0; i < DownloadsComponent.DONT_BREAK_CASTLE_LIMIT + 1; i++) {
      episodes.push({doc: undefined, id: i, seriesId: 37800, title: i.toString(), publishedAt: new Date()});
    }
    comp.store.dispatch(new CmsAllPodcastEpisodeGuidsAction({podcast, episodes}));
    expect(comp.filter.episodes.length).toEqual(DownloadsComponent.DONT_BREAK_CASTLE_LIMIT);
  });
});
