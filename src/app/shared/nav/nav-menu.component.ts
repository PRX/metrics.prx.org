import { Component, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { PodcastModel, EpisodeModel, RouterModel, CHARTTYPE_EPISODES,
  MetricsType, METRICSTYPE_DOWNLOADS, METRICSTYPE_TRAFFICSOURCES, METRICSTYPE_DEMOGRAPHICS,
  PodcastPerformanceMetricsModel, EpisodePerformanceMetricsModel } from '../../ngrx/';
import {  selectSelectedPodcast, selectRecentEpisode, selectRouter,
  selectSelectedPodcastPerformanceMetrics, selectRecentEpisodePerformanceMetrics } from '../../ngrx/reducers/selectors';
import * as ACTIONS from '../../ngrx/actions';

@Component({
  selector: 'metrics-nav-menu',
  template: `
    <metrics-profile
      [podcast]="selectedPodcast$ | async"
      [episode]="mostRecentEpisode$ | async"
      [podcastPerformance]="podcastPerformance$ | async"
      [episodePerformance]="episodePerformance$ | async"
      (chartEpisode)="onChartSingleEpisode($event)"></metrics-profile>
    <nav>
      <button *ngFor="let t of types"
          (click)="routeMetricsType(t.type)"
         [class.active]="routerState.metricsType === t.type">{{t.name}}</button>
    </nav>
  `,
  styleUrls: ['nav-menu.component.css']
})
export class NavMenuComponent implements OnDestroy {
  routerSub: Subscription;
  selectedPodcast$: Observable<PodcastModel>;
  mostRecentEpisode$: Observable<EpisodeModel>;
  podcastPerformance$: Observable<PodcastPerformanceMetricsModel>;
  episodePerformance$: Observable<EpisodePerformanceMetricsModel>;
  routerState: RouterModel;
  types = [
    {name: 'Downloads', type: METRICSTYPE_DOWNLOADS},
    {name: 'Demographics', type: METRICSTYPE_DEMOGRAPHICS},
    {name: 'Traffic Sources', type: METRICSTYPE_TRAFFICSOURCES}
  ];

  constructor(public store: Store<any>) {
    this.selectedPodcast$ = this.store.pipe(select(selectSelectedPodcast));
    this.mostRecentEpisode$ = this.store.pipe(select(selectRecentEpisode));
    this.podcastPerformance$ = this.store.pipe(select(selectSelectedPodcastPerformanceMetrics));
    this.episodePerformance$ = this.store.pipe(select(selectRecentEpisodePerformanceMetrics));

    this.routerSub = this.store.pipe(select(selectRouter)).subscribe((routerState) => this.routerState = routerState);
  }

  ngOnDestroy() {
    if (this.routerSub) { this.routerSub.unsubscribe(); }
  }

  routeMetricsType(metricsType: MetricsType) {
    this.store.dispatch(new ACTIONS.RouteMetricsTypeAction({metricsType}));
  }

  onChartSingleEpisode(episodeId) {
    this.store.dispatch(new ACTIONS.RouteSingleEpisodeChartedAction({
      episodeId: episodeId,
      chartType: CHARTTYPE_EPISODES,
      page: 1
    }));
  }
}
