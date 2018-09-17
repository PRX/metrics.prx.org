import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';
import * as ACTIONS from '../ngrx/actions';
import { reducers } from '../ngrx/reducers';

import { GeoComponent } from './geo.component';
import { SoonComponent } from './soon.component';
import {
  podcast,
  podcastGeoCountryDownloads,
  podcastGeoCountryRanks,
  routerParams as downloadParams
} from '../../testing/downloads.fixtures';
import { GroupType, GROUPTYPE_GEOCOUNTRY, GROUPTYPE_GEOSUBDIV, GROUPTYPE_GEOMETRO, MetricsType, METRICSTYPE_DEMOGRAPHICS } from '../ngrx/reducers/models';

describe('GeoComponent', () => {
  let store: Store<any>;
  let comp: GeoComponent;
  let fix: ComponentFixture<GeoComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GeoComponent,
        SoonComponent
      ],
      imports: [
        SharedModule,
        StoreModule.forRoot(reducers),
        RouterTestingModule
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(GeoComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
      store = TestBed.get(Store);
    });
  }));

  const routerParams = {...downloadParams, metricsType:<MetricsType>METRICSTYPE_DEMOGRAPHICS, group: <GroupType>GROUPTYPE_GEOCOUNTRY};
  function dispatchRouterNavigation() {
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams}));
  }

  function dispatchRouteGeoMetro() {
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {...routerParams, group: <GroupType>GROUPTYPE_GEOMETRO}}));
  }

  function dispatchPodcasts() {
    store.dispatch(new ACTIONS.CastlePodcastPageSuccessAction(
      {podcasts: [podcast], page: 1, total: 1}));
  }

  function dispatchPodcastGeoCountryTotals() {
    store.dispatch(new ACTIONS.CastlePodcastTotalsSuccessAction({
      id: routerParams.podcastId,
      group: GROUPTYPE_GEOCOUNTRY,
      ranks: podcastGeoCountryRanks
    }));
  }

  function dispatchPodcastGeoMetroTotals() {
    store.dispatch(new ACTIONS.CastlePodcastTotalsSuccessAction({
      id: routerParams.podcastId,
      group: GROUPTYPE_GEOMETRO,
      ranks: podcastGeoCountryRanks
    }));
  }

  function dispatchPodcastGeoCountryRanks() {
    store.dispatch(new ACTIONS.CastlePodcastRanksSuccessAction({
      id: routerParams.podcastId,
      group: GROUPTYPE_GEOCOUNTRY,
      interval: routerParams.interval,
      ranks: podcastGeoCountryRanks,
      downloads: podcastGeoCountryDownloads
    }));
  }

  function dispatchPodcastGeoMetroRanks() {
    store.dispatch(new ACTIONS.CastlePodcastRanksSuccessAction({
      id: routerParams.podcastId,
      group: GROUPTYPE_GEOMETRO,
      interval: routerParams.interval,
      ranks: podcastGeoCountryRanks,
      downloads: podcastGeoCountryDownloads
    }));
  }

  it('should create the component', async(() => {
    expect(comp).toBeTruthy();
  }));

  it('should show loading spinner when loading', () => {
    fix.detectChanges();
    expect(de.query(By.css('prx-spinner'))).not.toBeNull();
  });

  it('should show a nested totals table for GeoCountry', () => {
    dispatchPodcasts();
    dispatchRouterNavigation();
    dispatchPodcastGeoCountryTotals();
    dispatchPodcastGeoCountryRanks();
    fix.detectChanges();
    expect(de.query(By.css('prx-spinner'))).toBeNull();
    expect(de.query(By.css('metrics-nested-totals-table'))).not.toBeNull();
  });

  it('should show a totals table for GeoMetro', () => {
    dispatchPodcasts();
    dispatchRouteGeoMetro();
    dispatchPodcastGeoMetroTotals();
    dispatchPodcastGeoMetroRanks();
    fix.detectChanges();
    expect(de.query(By.css('prx-spinner'))).toBeNull();
    expect(de.query(By.css('metrics-totals-table'))).not.toBeNull();
  });
});
