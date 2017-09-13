import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { AuthModule, ModalModule } from 'ngx-prx-styleguide';
import { CoreModule } from './core';
import { SharedModule } from './shared';
import { AppComponent } from './app.component';

import { PodcastReducer } from './ngrx/reducers/podcast.reducer';
import { EpisodeReducer } from './ngrx/reducers/episode.reducer';
import { PodcastMetricsReducer } from './ngrx/reducers/podcast-metrics.reducer';
import { EpisodeMetricsReducer } from './ngrx/reducers/episode-metrics.reducer';
import { FilterReducer } from './ngrx/reducers/filter.reducer';

describe('AppComponent', () => {
  let comp: AppComponent;
  let fix: ComponentFixture<AppComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        CoreModule,
        AuthModule,
        ModalModule,
        RouterTestingModule,
        SharedModule,
        StoreModule.provideStore({
          filter: FilterReducer,
          podcast: PodcastReducer,
          episode: EpisodeReducer,
          podcastMetrics: PodcastMetricsReducer,
          episodeMetrics: EpisodeMetricsReducer
        })
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(AppComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should create the app', async(() => {
    expect(comp).toBeTruthy();
  }));

  it(`should only show header links when logged in`, async(() => {
    comp.loggedIn = true;
    fix.detectChanges();
    expect(de.queryAll(By.css('prx-navitem')).length).toEqual(2);
    comp.loggedIn = false;
    fix.detectChanges();
    expect(de.query(By.css('prx-navitem'))).toBeNull();
  }));

  it('should show user info when logged in', async(() => {
    comp.loggedIn = true;
    fix.detectChanges();
    expect(de.query(By.css('prx-navuser'))).toBeTruthy();
    comp.loggedIn = false;
    fix.detectChanges();
    expect(de.query(By.css('prx-navuser'))).toBeNull();
  }));
});
