import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';
import * as ACTIONS from '../ngrx/actions';
import { reducers } from '../ngrx/reducers';

import { GeoComponent } from './geo.component';
import { GeoChartComponent } from './geo-chart.component';
import { GeochartMapComponent } from './geochart.map.component';
import {
  podcast,
  podcastGeoCountryDownloads,
  podcastGeoCountryRanks,
  routerParams as downloadParams
} from '../../testing/downloads.fixtures';
import {
  ChartType, CHARTTYPE_LINE,
  GroupType, GROUPTYPE_GEOCOUNTRY, GROUPTYPE_GEOMETRO,
  MetricsType, METRICSTYPE_DEMOGRAPHICS } from '../ngrx/reducers/models';

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
        GeoChartComponent,
        GeochartMapComponent
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

  const routerParams = {...downloadParams, metricsType: <MetricsType>METRICSTYPE_DEMOGRAPHICS, group: <GroupType>GROUPTYPE_GEOCOUNTRY};
  function dispatchRouteGeoCountry() {
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams}));
  }

  function dispatchRouteGeoMetro() {
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {...routerParams, group: <GroupType>GROUPTYPE_GEOMETRO}}));
  }

  function dispatchRouteGeoLineChart() {
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {...routerParams, chartType: <ChartType>CHARTTYPE_LINE}}));
  }

  function dispatchPodcasts() {
    store.dispatch(new ACTIONS.CastlePodcastPageSuccessAction(
      {podcasts: [podcast], page: 1, total: 1}));
  }

  function dispatchPodcastGeoCountryTotals() {
    store.dispatch(new ACTIONS.CastlePodcastTotalsSuccessAction({
      podcastId: routerParams.podcastId,
      group: GROUPTYPE_GEOCOUNTRY,
      filter: routerParams.filter,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate,
      ranks: podcastGeoCountryRanks
    }));
  }

  function dispatchPodcastGeoMetroTotals() {
    store.dispatch(new ACTIONS.CastlePodcastTotalsSuccessAction({
      podcastId: routerParams.podcastId,
      group: GROUPTYPE_GEOMETRO,
      filter: routerParams.filter,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate,
      ranks: podcastGeoCountryRanks
    }));
  }

  function dispatchPodcastGeoCountryRanks() {
    store.dispatch(new ACTIONS.CastlePodcastRanksSuccessAction({
      podcastId: routerParams.podcastId,
      group: GROUPTYPE_GEOCOUNTRY,
      interval: routerParams.interval,
      filter: routerParams.filter,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate,
      ranks: podcastGeoCountryRanks,
      downloads: podcastGeoCountryDownloads
    }));
  }

  function dispatchPodcastGeoMetroRanks() {
    store.dispatch(new ACTIONS.CastlePodcastRanksSuccessAction({
      podcastId: routerParams.podcastId,
      group: GROUPTYPE_GEOMETRO,
      interval: routerParams.interval,
      filter: routerParams.filter,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate,
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

  beforeEach(() => {
    dispatchPodcasts();
  });

  it('should show a nested totals table for GeoCountry', () => {
    dispatchRouteGeoCountry();
    dispatchPodcastGeoCountryTotals();
    dispatchPodcastGeoCountryRanks();
    fix.detectChanges();
    expect(de.query(By.css('prx-spinner'))).toBeNull();
    expect(de.query(By.css('metrics-nested-totals-table'))).not.toBeNull();
  });

  it('should show a totals table for GeoMetro', () => {
    dispatchRouteGeoMetro();
    dispatchPodcastGeoMetroTotals();
    dispatchPodcastGeoMetroRanks();
    fix.detectChanges();
    expect(de.query(By.css('prx-spinner'))).toBeNull();
    expect(de.query(By.css('metrics-totals-table'))).not.toBeNull();
  });

  it('should show a chart for non geo chart types', () => {
    dispatchRouteGeoLineChart();
    dispatchPodcastGeoCountryTotals();
    dispatchPodcastGeoCountryRanks();
    fix.detectChanges();
    expect(de.query(By.css('prx-spinner'))).toBeNull();
    expect(de.query(By.css('metrics-geo-chart'))).not.toBeNull();
  });
});
