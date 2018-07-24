import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';
import { ImageModule } from 'ngx-prx-styleguide';
import { AbrevNumberPipe } from '../pipes/abrev-number.pipe';

import { reducers } from '../../ngrx/reducers';
import { RouterParams, ChartType, MetricsType,
  CHARTTYPE_PODCAST, INTERVAL_DAILY,
  METRICSTYPE_DOWNLOADS, METRICSTYPE_DEMOGRAPHICS, METRICSTYPE_TRAFFICSOURCES } from '../../ngrx';
import * as ACTIONS from '../../ngrx/actions';

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
  let store: Store<any>;
  let navLinks;

  const podcasts: any[] = [
    {seriesId: 37800, title: 'Podcast 1', feederId: '70'},
    {seriesId: 37801, title: 'Podcast 2', feederId: '72'}
  ];

  const episode: any = {
    seriesId: 37800,
    id: 2,
    title: 'Episode 2',
    publishedAt: new Date('2017-09-21T00:00:00Z')
  };

  const routerParams: RouterParams = {
    podcastSeriesId: podcasts[0].seriesId,
    metricsType: <MetricsType>METRICSTYPE_DOWNLOADS,
    chartType: <ChartType>CHARTTYPE_PODCAST,
    interval: INTERVAL_DAILY
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavMenuComponent,
        ProfileComponent,
        AbrevNumberPipe,
        TestComponent
      ],
      imports: [
        ImageModule,
        RouterTestingModule,
        StoreModule.forRoot(reducers),
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(NavMenuComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
      store = TestBed.get(Store);

      store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerState: routerParams}));
      store.dispatch(new ACTIONS.CmsPodcastsSuccessAction({podcasts}));
      store.dispatch(new ACTIONS.CmsRecentEpisodeSuccessAction({episode}));
      fix.detectChanges();
      navLinks = de.queryAll(By.css('button'));

      spyOn(store, 'dispatch');
    });
  }));

  it('should have navigation to Reach', () => {
    expect(navLinks.find(link => link.nativeElement.innerText === 'Reach'.toUpperCase())).not.toBeNull();
    comp.routeMetricsType(METRICSTYPE_DOWNLOADS);
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.RouteMetricsTypeAction({metricsType: METRICSTYPE_DOWNLOADS}));
  });

  it('should have navigation to Demographics', () => {
    expect(navLinks.find(link => link.nativeElement.innerText === 'Demographics'.toUpperCase())).not.toBeNull();
    comp.routeMetricsType(METRICSTYPE_DEMOGRAPHICS);
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.RouteMetricsTypeAction({metricsType: METRICSTYPE_DEMOGRAPHICS}));
  });

  it('should have navigation to Devices', () => {
    expect(navLinks.find(link => link.nativeElement.innerText === 'Devices'.toUpperCase())).not.toBeNull();
    comp.routeMetricsType(METRICSTYPE_TRAFFICSOURCES);
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.RouteMetricsTypeAction({metricsType: METRICSTYPE_TRAFFICSOURCES}));
  });

  it('should show dropdown when open', () => {
    expect(de.query(By.css('.dropdown.open'))).toBeNull();
    comp.toggleOpen();
    fix.detectChanges();
    expect(de.query(By.css('.dropdown.open'))).not.toBeNull();
  });

  it('should close the dropdown on window scroll', () => {
    comp.open = true;
    window.dispatchEvent(new Event('scroll'));
    expect(comp.open).toBeFalsy();
  });
});
