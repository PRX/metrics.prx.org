import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';
import { Location } from '@angular/common';
import { Router, Route } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { ImageModule } from 'ngx-prx-styleguide';
import { AbrevNumberPipe } from '../pipes/abrev-number.pipe';

import { reducers } from '../../ngrx/reducers';
import { RouterModel, ChartType, MetricsType,
  CHARTTYPE_PODCAST, INTERVAL_DAILY, METRICSTYPE_DOWNLOADS } from '../../ngrx';
import { CustomRouterNavigationAction, CmsPodcastsSuccessAction, CmsRecentEpisodeSuccessAction } from '../../ngrx/actions';

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

  const routerState: RouterModel = {
    podcastSeriesId: podcasts[0].seriesId,
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
        AbrevNumberPipe,
        TestComponent
      ],
      imports: [
        ImageModule,
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

      comp.store.dispatch(new CustomRouterNavigationAction({routerState}));
      comp.store.dispatch(new CmsPodcastsSuccessAction({podcasts}));
      comp.store.dispatch(new CmsRecentEpisodeSuccessAction({episode}));
      fix.detectChanges();
      navLinks = de.queryAll(By.css('a'));
    });
  }));

  it('should set selected podcast according to routerState', () => {
    let result;
    comp.selectedPodcast$.subscribe(value => result = value);
    expect(result).toEqual(podcasts[0]);
  });

  it('should set the most recent episode for a podcast', () => {
    let result;
    comp.mostRecentEpisode$.subscribe(value => result = value);
    expect(result).toEqual(episode);
  });

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
