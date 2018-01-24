import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';
import { Location } from '@angular/common';
import { Router, Route } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { reducers } from '../../ngrx/reducers';
import { RouterModel, ChartType, MetricsType,
  CHARTTYPE_PODCAST, INTERVAL_DAILY, METRICSTYPE_DOWNLOADS } from '../../ngrx';
import { CustomRouterNavigationAction } from '../../ngrx/actions';

import { NavMenuComponent } from './nav-menu.component';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'metrics-test-component',
  template: ``
})
class TestComponent {}

describe('NavMenuComponent', () => {
  let comp: NavMenuComponent;
  let fix: ComponentFixture<NavMenuComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let router: Router;
  let location: Location;
  let navLinks;

  const routerState: RouterModel = {
    podcastSeriesId: 37800,
    metricsType: <MetricsType>METRICSTYPE_DOWNLOADS,
    chartType: <ChartType>CHARTTYPE_PODCAST,
    interval: INTERVAL_DAILY
  };

  const routes: Route[] = [
    {
      path: ':seriesId/downloads/:chartType/:interval',
      component: TestComponent
    },
    {
      path: ':seriesId/demographics',
      component: TestComponent
    },
    {
      path: ':seriesId/traffic-sources',
      component: TestComponent
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavMenuComponent,
        ProfileComponent,
        TestComponent
      ],
      imports: [
        RouterTestingModule.withRoutes(routes),
        StoreModule.forRoot(reducers),
      ],
      providers: [
        Location
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(NavMenuComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
      router = TestBed.get(Router);
      location = TestBed.get(Location);
      router.initialNavigation();

      // This action is normally sent out by the ngrx StoreRouterConnectingModule
      // and _not_ by the application
      // We're mocking it up here so our custom router reducer reducer runs and the router selector gives us the state
      // Need to mock `event` because the Ngrx router reducer needs the RoutesRecognized event
      // The application only uses routerState, our serialized custom RouterModel
      comp.store.dispatch(new CustomRouterNavigationAction({routerState}));
      fix.detectChanges();
      navLinks = de.queryAll(By.css('a'));
    });
  }));

  it('should have navigation to podcast Downloads', fakeAsync(() => {
    const downloadsLink = navLinks.find(link => link.nativeElement.innerText === 'Downloads');
    expect(downloadsLink).not.toBeNull();
    downloadsLink.nativeElement.click();
    tick();
    expect(location.path()).toBe('/37800/downloads/podcast/daily');
  }));

  it('should have navigation to podcast Demographics', fakeAsync(() => {
    const demographicsLink = navLinks.find(link => link.nativeElement.innerText === 'Demographics');
    expect(demographicsLink).not.toBeNull();
    demographicsLink.nativeElement.click();
    tick();
    expect(location.path()).toBe('/37800/demographics');
  }));

  it('should have navigation to podcast Traffic Sources', fakeAsync(() => {
    const demographicsLink = navLinks.find(link => link.nativeElement.innerText === 'Traffic Sources');
    expect(demographicsLink).not.toBeNull();
    demographicsLink.nativeElement.click();
    tick();
    expect(location.path()).toBe('/37800/traffic-sources');
  }));
});
