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
import { AccountModel, PodcastModel, FilterModel, INTERVAL_DAILY } from './ngrx';
import * as ACTIONS from './ngrx/actions';

/* tslint:disable-next-line:component-selector */
@Component({selector: 'prx-auth', template: 'mock-prx-auth'})
class MockAuthComponent { @Input() host: any; @Input() client: any; }

describe('AppComponent', () => {
  let comp: AppComponent;
  let fix: ComponentFixture<AppComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const account: AccountModel = {id: 1234, name: 'Joey JoJo Jr Shabadoo'};
  const podcasts: PodcastModel[] = [{seriesId: 9876, title: 'Foobar'}];
  const filter: FilterModel = {
    podcastSeriesId: 9876,
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
    expect(de.query(By.css('metrics-podcasts'))).toBeTruthy();
    comp.store.dispatch(new ACTIONS.CmsAccountFailureAction({error: 'whatevs'}));
    fix.detectChanges();
    expect(de.query(By.css('metrics-podcasts'))).toBeNull();
  }));

  it('should show user info when logged in', async(() => {
    expect(de.query(By.css('prx-navuser'))).toBeTruthy();
    expect(el.textContent).toContain('Joey JoJo Jr Shabadoo');
    comp.store.dispatch(new ACTIONS.CmsAccountFailureAction({error: 'whatevs'}));
    fix.detectChanges();
    expect(de.query(By.css('prx-navuser'))).toBeNull();
    expect(el.textContent).not.toContain('Joey JoJo Jr Shabadoo');
  }));

  it('should load series podcast and dispatch CMS actions', () => {
    spyOn(comp.store, 'dispatch').and.callThrough();
    comp.store.dispatch(new ACTIONS.CastleFilterAction({filter}));
    expect(comp.store.dispatch).toHaveBeenCalledWith(jasmine.any(ACTIONS.CmsPodcastEpisodePageAction));
  });
});
