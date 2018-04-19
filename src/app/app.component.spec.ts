import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { By } from '@angular/platform-browser';

import { Angulartics2, Angulartics2GoogleAnalytics } from 'angulartics2';
import { CoreModule } from './core';
import { SharedModule } from './shared';
import { AppComponent } from './app.component';

import { reducers } from './ngrx/reducers';
import { AccountModel, PodcastModel, RouterModel, ChartType, MetricsType,
  CHARTTYPE_PODCAST, INTERVAL_DAILY, METRICSTYPE_DOWNLOADS } from './ngrx';
import * as ACTIONS from './ngrx/actions';
import { Userinfo, UserinfoService } from 'ngx-prx-styleguide';

/* tslint:disable-next-line:component-selector */
@Component({selector: 'prx-auth', template: 'mock-prx-auth'})
class MockAuthComponent { @Input() host: any; @Input() client: any; }

describe('AppComponent', () => {
  let comp: AppComponent;
  let fix: ComponentFixture<AppComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let userinfo = new Userinfo();
  userinfo.name = 'Joey JoJo Jr Shabadoo';

  const account: AccountModel = {id: 1234, name: 'Joey JoJo Jr Shabadoo'};
  const podcasts: PodcastModel[] = [{seriesId: 9876, title: 'Foobar'}];
  const routerState: RouterModel = {
    podcastSeriesId: 9876,
    metricsType: <MetricsType>METRICSTYPE_DOWNLOADS,
    chartType: <ChartType>CHARTTYPE_PODCAST,
    beginDate: new Date('2017-08-27T00:00:00Z'),
    endDate: new Date('2017-09-07T00:00:00Z'),
    interval: INTERVAL_DAILY
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockAuthComponent,
        AppComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: ':seriesId/downloads/:chartType/:interval', component: MockAuthComponent }
        ]),
        CoreModule,
        SharedModule,
        StoreModule.forRoot(reducers)
      ],
      providers: [
        {provide: UserinfoService, useValue: { getUserinfo: userinfo }},
        Angulartics2GoogleAnalytics,
        Angulartics2
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(AppComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
      comp.store.dispatch(new ACTIONS.CmsAccountSuccessAction({account}));
      comp.store.dispatch(new ACTIONS.CmsPodcastsSuccessAction({podcasts}));
      fix.detectChanges();
    });
  }));

  it('should create the app', async(() => {
    expect(comp).toBeTruthy();
  }));

  it(`should show podcasts when logged in`, async(() => {
    expect(de.query(By.css('metrics-podcast-nav'))).toBeTruthy();
    comp.store.dispatch(new ACTIONS.CmsAccountFailureAction({error: 'whatevs'}));
    fix.detectChanges();
    expect(de.query(By.css('metrics-podcast-nav'))).toBeNull();
  }));

  it('should show user info when logged in', async(() => {
    expect(de.query(By.css('prx-navuser'))).toBeTruthy();
    expect(el.textContent).toContain('Joey JoJo Jr Shabadoo');
    comp.store.dispatch(new ACTIONS.CmsAccountFailureAction({error: 'whatevs'}));
    fix.detectChanges();
    expect(de.query(By.css('prx-navuser'))).toBeNull();
    expect(el.textContent).not.toContain('Joey JoJo Jr Shabadoo');
  }));

  it('should dispatch episode load action when series or page has changed', () => {
    spyOn(comp.store, 'dispatch').and.callThrough();
    comp.store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerState}));
    expect(comp.store.dispatch).toHaveBeenCalledWith(jasmine.any(ACTIONS.CmsPodcastEpisodePageAction));
  });

  it('should dispatch recent episode action when series has changed', () => {
    spyOn(comp.store, 'dispatch').and.callThrough();
    comp.store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerState}));
    expect(comp.store.dispatch).toHaveBeenCalledWith(jasmine.any(ACTIONS.CmsRecentEpisodeAction));
  });
});
