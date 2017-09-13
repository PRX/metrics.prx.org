import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';

import { AuthModule, AuthService, ModalModule, MockHalService } from 'ngx-prx-styleguide';
import { CoreModule, CmsService } from './core';
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
  let auth;
  let cms;
  let authToken;
  let refreshToken;
  let cmsToken: string = null;

  beforeEach(async(() => {
    cms = new MockHalService();
    authToken = new Subject<string>();
    refreshToken = new Subject<boolean>();
    auth = cms.mock('prx:authorization', {});
    auth.mockItems('prx:series', []);
    auth.mockItems('prx:stories', []);

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
      ],
      providers: [
        {provide: AuthService, useValue: {
          config: () => {},
          url: () => '',
          token: authToken,
          refresh: refreshToken
        }},
        {provide: CmsService, useValue: {
          setToken: token => cmsToken = token,
          account: new Subject<any>(),
          individualAccount: new Subject<any>()
        }}
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

  it('should load series and call CMS action', () => {
    // authToken.next('fake-token');
    auth.mockItems('prx:series', [
      {seriesId: 37800, title: 'Pet Talks Daily'},
      {seriesId: 37801, title: 'Totally Not Pet Talks Daily'}]);
  });
});
