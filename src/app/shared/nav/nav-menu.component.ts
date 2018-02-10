import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { PodcastModel, EpisodeModel, RouterModel, CHARTTYPE_EPISODES } from '../../ngrx';
import { selectSelectedPodcast, selectRecentEpisode, selectRouter,
  selectPodcastProfileMetrics, selectRecentEpisodeProfileMetrics } from '../../ngrx/reducers';
import { RouteSingleEpisodeChartedAction } from '../../ngrx/actions';

interface Nav {
  link: string;
  name: string;
  exact: boolean;
}

@Component({
  selector: 'metrics-nav-menu',
  template: `
    <metrics-profile
      [podcast]="selectedPodcast$ | async"
      [episode]="mostRecentEpisode$ | async"
      [podcastDownloadsToday]="podcastDownloadsToday"
      [podcastDownloads7day]="podcastDownloads7day"
      [episodeDownloadsToday]="episodeDownloadsToday"
      [episodeDownloadsAllTime]="episodeDownloadsAllTime"
      (chartEpisode)="onChartSingleEpisode($event)"></metrics-profile>
    <nav>
      <a *ngFor="let item of nav$ | async"
         [routerLink]="item.link"
         routerLinkActive="active"
         [routerLinkActiveOptions]="{exact: item.exact}">{{item.name}}</a>
    </nav>
  `,
  styleUrls: ['nav-menu.component.css']
})
export class NavMenuComponent {
  nav$: Observable<Nav[]>;
  selectedPodcast$: Observable<PodcastModel>;
  mostRecentEpisode$: Observable<EpisodeModel>;
  podcastDownloadsToday: number;
  podcastDownloads7day: number;
  episodeDownloadsToday: number;
  episodeDownloadsAllTime: number;

  constructor(public store: Store<any>) {
    this.selectedPodcast$ = this.store.select(selectSelectedPodcast);
    this.mostRecentEpisode$ = this.store.select(selectRecentEpisode);
    this.store.select(selectPodcastProfileMetrics).subscribe(podcastProfileMetrics => {
      if (podcastProfileMetrics) {
        this.podcastDownloadsToday = podcastProfileMetrics.today;
        this.podcastDownloads7day = podcastProfileMetrics.this7days;
      }
    });
    this.store.select(selectRecentEpisodeProfileMetrics).subscribe(episodeProfileMetrics => {
      if (episodeProfileMetrics) {
        this.episodeDownloadsToday = episodeProfileMetrics.today;
        this.episodeDownloadsAllTime = episodeProfileMetrics.allTimeDownloads;
      }
    });
    this.nav$ = this.store.select(selectRouter).map((routerState: RouterModel) => {
      if (routerState.podcastSeriesId) {
        let routes;

        if (routerState.chartType && routerState.interval) {
          routes = [{
            link: `/${routerState.podcastSeriesId}/downloads/${routerState.chartType}/${routerState.interval.key}`,
            name: 'Downloads',
            exact: false
          }];
        } else {
          routes = [{
            link: `/${routerState.podcastSeriesId}/downloads`,
            name: 'Downloads',
            exact: false
          }];
        }

        routes.push(
          {
            link: `/${routerState.podcastSeriesId}/demographics`,
            name: 'Demographics',
            exact: false
          },
          {
            link: `/${routerState.podcastSeriesId}/traffic-sources`,
            name: 'Traffic Sources',
            exact: false
          }
        );

        return routes;
      }
    });
  }

  onChartSingleEpisode(episodeId) {
    this.store.dispatch(new RouteSingleEpisodeChartedAction({
      episodeId: episodeId,
      chartType: CHARTTYPE_EPISODES,
      page: 1
    }));
  }
}
