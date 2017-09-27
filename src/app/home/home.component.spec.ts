import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { HalService, MockHalService } from 'ngx-prx-styleguide';
import { CastleService } from '../core';
import { SharedModule } from '../shared';
import { DownloadsModule } from '../downloads/downloads.module';
import { HomeComponent } from './home.component';

import { PodcastReducer } from '../ngrx/reducers/podcast.reducer';
import { EpisodeReducer } from '../ngrx/reducers/episode.reducer';
import { PodcastMetricsReducer } from '../ngrx/reducers/podcast-metrics.reducer';
import { EpisodeMetricsReducer } from '../ngrx/reducers/episode-metrics.reducer';
import { FilterReducer } from '../ngrx/reducers/filter.reducer';

describe('HomeComponent', () => {
  let comp: HomeComponent;
  let fix: ComponentFixture<HomeComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  const mockHal = new MockHalService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        DownloadsModule,
        StoreModule.forRoot({
          filter: FilterReducer,
          podcast: PodcastReducer,
          episode: EpisodeReducer,
          podcastMetrics: PodcastMetricsReducer,
          episodeMetrics: EpisodeMetricsReducer
        })
      ],
      declarations: [ HomeComponent ],
      providers : [
        CastleService,
        {provide: HalService, useValue: mockHal}
      ]
    })
    .compileComponents().then(() => {
      fix = TestBed.createComponent(HomeComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should be created', () => {
    expect(comp).toBeTruthy();
  });
});
