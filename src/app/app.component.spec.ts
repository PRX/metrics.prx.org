import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { AuthModule, AuthService, ModalModule, MockHalService, MockHalDoc } from 'ngx-prx-styleguide';
import { CoreModule, CmsService } from './core';
import { SharedModule } from './shared';
import { AppComponent } from './app.component';

import { PodcastReducer } from './ngrx/reducers/podcast.reducer';
import { EpisodeReducer } from './ngrx/reducers/episode.reducer';
import { PodcastMetricsReducer } from './ngrx/reducers/podcast-metrics.reducer';
import { EpisodeMetricsReducer } from './ngrx/reducers/episode-metrics.reducer';
import { FilterReducer } from './ngrx/reducers/filter.reducer';

import * as CastleActions from './ngrx/actions/castle.action.creator';
import * as CmsActions from './ngrx/actions/cms.action.creator';
import { PodcastModel, FilterModel, INTERVAL_DAILY } from './ngrx/model/';

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
          auth: Observable.of(auth),
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

  it('should load series podcast and episode and call CMS actions', () => {
    spyOn(CmsActions, 'cmsPodcastFeed').and.callThrough();
    spyOn(CmsActions, 'cmsEpisodeGuid').and.callThrough();
    const podcast: PodcastModel = {
      doc: auth.mock('prx:series', {seriesId: 37800, title: 'Pet Talks Daily'}),
      seriesId: 37800,
      feederId: '70',
      title: 'Pet Talks Daily'
    };
    const filter: FilterModel = {
      podcast,
      beginDate: new Date('2017-08-27T00:00:00Z'),
      endDate: new Date('2017-09-07T00:00:00Z'),
      interval: INTERVAL_DAILY
    };
    const series = auth.mockItems('prx:series', [
      {seriesId: 37800, title: 'Pet Talks Daily'},
      {seriesId: 37801, title: 'Totally Not Pet Talks Daily'}]);
    series.forEach(s => {
      const distributions = s.mockItems('prx:distributions', [{kind: 'podcast', url: 'https://feeder.prx.org/api/v1/podcasts/70'}]);
      const episodes = s.mockItems('prx:stories', [{id: 123, title: 'A Pet Talk Episode', publishedAt: new Date()}]);
      episodes.forEach(e => {
        e.mockItems('prx:distributions',
          [{kind: 'episode', url: 'https://feeder.prx.org/api/v1/episodes/42b4ad11-36bd-4f3a-9e92-0de8ad43a515'}]);
      });
    });
    // TODO this is an awful lot of what looks like redundant mocking. will try to do a better set up but just trying to get there for now
    const episodes = (<MockHalDoc>podcast.doc).mockItems('prx:stories', [{id: 123, title: 'A Pet Talk Episode', publishedAt: new Date()}]);
    episodes.forEach(e => {
      e.mockItems('prx:distributions',
        [{kind: 'episode', url: 'https://feeder.prx.org/api/v1/episodes/42b4ad11-36bd-4f3a-9e92-0de8ad43a515'}]);
    });
    comp.store.dispatch(CastleActions.castleFilter(filter));
    authToken.next('fake-token');
    expect(CmsActions.cmsPodcastFeed).toHaveBeenCalled();
    expect(CmsActions.cmsEpisodeGuid).toHaveBeenCalled();
  });
});
