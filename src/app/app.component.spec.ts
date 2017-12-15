import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Angulartics2, Angulartics2GoogleAnalytics } from 'angulartics2';

import { AuthModule, AuthService, ModalModule, MockHalService, MockHalDoc } from 'ngx-prx-styleguide';
import { CoreModule, CmsService } from './core';
import { SharedModule } from './shared';
import { AppComponent } from './app.component';

import { reducers } from './ngrx/reducers';

import { CastleFilterAction, CmsPodcastEpisodePageAction, CmsPodcastsSuccessAction } from './ngrx/actions';
import { FilterModel, INTERVAL_DAILY, PodcastModel } from './ngrx';

@Component({template: ''})
export class DummyComponent {}

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
  let podcast: PodcastModel,
    filter: FilterModel;
  let series: MockHalDoc[],
    episodes: MockHalDoc[];

  beforeEach(async(() => {
    cms = new MockHalService();
    authToken = new Subject<string>();
    refreshToken = new Subject<boolean>();
    auth = cms.mock('prx:authorization', {});

    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        DummyComponent
      ],
      imports: [
        CoreModule,
        AuthModule,
        ModalModule,
        SharedModule,
        StoreModule.forRoot(reducers),
        RouterTestingModule.withRoutes([
          { path: ':seriesId/downloads/daily', component: DummyComponent }
        ])
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
        }},
        {provide: Angulartics2GoogleAnalytics},
        {provide: Angulartics2}
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(AppComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      spyOn(comp, 'getSeriesPodcastDistribution').and.callThrough();
      spyOn(comp.store, 'dispatch').and.callThrough();

      podcast = {
        doc: auth.mock('prx:series', {seriesId: 37800, title: 'Pet Talks Daily'}),
        seriesId: 37800,
        feederId: '70',
        title: 'Pet Talks Daily'
      };

      filter = {
        podcastSeriesId: podcast.seriesId,
        beginDate: new Date('2017-08-27T00:00:00Z'),
        endDate: new Date('2017-09-07T00:00:00Z'),
        interval: INTERVAL_DAILY
      };

      series = auth.mockItems('prx:series', [
        {id: 37800, title: 'Pet Talks Daily'},
        {id: 37801, title: 'Totally Not Pet Talks Daily'}]);

      series.forEach(s => {
        const distributions = s.mockItems('prx:distributions', [{kind: 'podcast', url: 'https://feeder.prx.org/api/v1/podcasts/70'}]);
      });
    });
  }));

  it('should create the app', async(() => {
    expect(comp).toBeTruthy();
  }));

  it(`should show podcasts when logged in`, async(() => {
    comp.loggedIn = true;
    fix.detectChanges();
    expect(de.query(By.css('metrics-podcasts'))).not.toBeNull();
    comp.loggedIn = false;
    fix.detectChanges();
    expect(de.query(By.css('metrics-podcasts'))).toBeNull();
  }));

  it('should show user info when logged in', async(() => {
    comp.loggedIn = true;
    fix.detectChanges();
    expect(de.query(By.css('prx-navuser'))).toBeTruthy();
    comp.loggedIn = false;
    fix.detectChanges();
    expect(de.query(By.css('prx-navuser'))).toBeNull();
  }));

  it('should load series podcast and dispatch CMS actions', () => {
    comp.store.dispatch(new CmsPodcastsSuccessAction({podcasts: [podcast]}));
    comp.store.dispatch(new CastleFilterAction({filter}));
    authToken.next('fake-token');

    expect(comp.getSeriesPodcastDistribution).toHaveBeenCalled();
    expect(comp.store.dispatch).toHaveBeenCalledWith(jasmine.any(CmsPodcastsSuccessAction));
    expect(comp.store.dispatch).toHaveBeenCalledWith(jasmine.any(CmsPodcastEpisodePageAction));
  });
});
