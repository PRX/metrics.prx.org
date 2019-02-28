import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';
import { FancyFormModule } from 'ngx-prx-styleguide';

import { SharedModule } from '../shared/shared.module';
import * as ACTIONS from '../ngrx/actions';
import { reducers } from '../ngrx/reducers';
import { MetricsType, GroupType, GROUPTYPE_AGENTNAME, METRICSTYPE_TRAFFICSOURCES } from '../ngrx/reducers/models';

import { UserAgentsComponent } from './user-agents.component';
import { UserAgentsChartComponent } from './user-agents-chart.component';
import { podcast, routerParams as downloadParams,
  podcastAgentNameRanks, podcastAgentNameDownloads } from '../../testing/downloads.fixtures';

describe('UserAgentsComponent', () => {
  let store: Store<any>;
  let comp: UserAgentsComponent;
  let fix: ComponentFixture<UserAgentsComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserAgentsComponent,
        UserAgentsChartComponent
      ],
      imports: [
        SharedModule,
        FancyFormModule,
        StoreModule.forRoot(reducers),
        RouterTestingModule
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(UserAgentsComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
      store = TestBed.get(Store);
    });
  }));

  const routerParams = {...downloadParams, metricsType: <MetricsType>METRICSTYPE_TRAFFICSOURCES, group: <GroupType>GROUPTYPE_AGENTNAME};
  function dispatchRouterNavigation() {
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams}));
  }

  function dispatchPodcasts() {
    store.dispatch(new ACTIONS.CastlePodcastPageSuccessAction(
      {podcasts: [podcast], page: 1, total: 1}));
  }

  function dispatchPodcastAgentNameTotals() {
    store.dispatch(new ACTIONS.CastlePodcastTotalsSuccessAction({
      podcastId: routerParams.podcastId,
      group: GROUPTYPE_AGENTNAME,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate,
      ranks: podcastAgentNameRanks
    }));
  }

  function dispatchPodcastAgentNameRanks() {
    store.dispatch(new ACTIONS.CastlePodcastRanksSuccessAction({
      podcastId: routerParams.podcastId,
      group: GROUPTYPE_AGENTNAME,
      interval: routerParams.interval,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate,
      ranks: podcastAgentNameRanks,
      downloads: podcastAgentNameDownloads
    }));
  }

  it('should create the component', async(() => {
    expect(comp).toBeTruthy();
  }));

  it('should show loading spinner when loading', () => {
    fix.detectChanges();
    expect(de.query(By.css('prx-spinner'))).not.toBeNull();
  });

  it('should show a totals table', () => {
    dispatchPodcasts();
    dispatchRouterNavigation();
    dispatchPodcastAgentNameTotals();
    dispatchPodcastAgentNameRanks();
    fix.detectChanges();
    expect(de.query(By.css('prx-spinner'))).toBeNull();
    expect(de.query(By.css('metrics-totals-table'))).not.toBeNull();
  });
});
