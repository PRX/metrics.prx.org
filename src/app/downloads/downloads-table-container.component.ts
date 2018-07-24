import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { DownloadsTableModel, EpisodeModel, RouterParams, CHARTTYPE_EPISODES } from '../ngrx';
import { selectRouter, selectSelectedPageEpisodes,
  selectDownloadTablePodcastMetrics, selectDownloadTableEpisodeMetrics } from '../ngrx/reducers/selectors';
import * as ACTIONS from '../ngrx/actions';

@Component({
  selector: 'metrics-downloads-table',
  template: `
    <metrics-downloads-table-presentation
      [totalPages]="totalPages"
      [podcastTableData]="podcastTableData$ | async"
      [episodeTableData]="episodeTableData$ | async"
      [routerParams]="routerParams$ | async"
      [expanded]="expanded"
      (toggleChartPodcast)="toggleChartPodcast($event)"
      (toggleChartEpisode)="toggleChartEpisode($event)"
      (chartSingleEpisode)="onChartSingleEpisode($event)"
      (pageChange)="onPageChange($event)"
      (toggleExpandedReport)="toggleExpandedReport()">
    </metrics-downloads-table-presentation>
  `
})
export class DownloadsTableContainerComponent implements OnInit, OnDestroy {
  @Input() totalPages;
  podcastTableData$: Observable<DownloadsTableModel>;
  episodeTableData$: Observable<DownloadsTableModel[]>;
  routerParams$: Observable<RouterParams>;
  episodePageSub: Subscription;
  expanded = false;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.podcastTableData$ = this.store.pipe(select(selectDownloadTablePodcastMetrics));
    this.episodeTableData$ = this.store.pipe(select(selectDownloadTableEpisodeMetrics));
    this.routerParams$ = this.store.pipe(select(selectRouter));

    this.episodePageSub = this.store.pipe(select(selectSelectedPageEpisodes)).subscribe((pageEpisodes: EpisodeModel[]) => {
      pageEpisodes.forEach(episode => {
        const { id, seriesId, guid } = episode;
        this.store.dispatch(new ACTIONS.CastleEpisodePerformanceMetricsLoadAction({id, seriesId, guid}));
      });
    });
  }

  ngOnDestroy() {
    if (this.episodePageSub) { this.episodePageSub.unsubscribe(); }
  }

  toggleChartPodcast(chartPodcast: boolean) {
    this.store.dispatch(new ACTIONS.RoutePodcastChartedAction({chartPodcast}));
  }

  toggleChartEpisode(params: {episodeId: number, charted: boolean}) {
    this.store.dispatch(new ACTIONS.RouteToggleEpisodeChartedAction({episodeId: params.episodeId, charted: params.charted}));
  }

  onChartSingleEpisode(episodeId: number) {
    this.store.dispatch(new ACTIONS.RouteSingleEpisodeChartedAction({episodeId, chartType: CHARTTYPE_EPISODES}));
  }

  onPageChange(episodePage: number) {
    this.store.dispatch(new ACTIONS.RouteEpisodePageAction({episodePage}));
  }

  toggleExpandedReport() {
    this.expanded = !this.expanded;
    if (this.expanded) {
      this.store.dispatch(new ACTIONS.GoogleAnalyticsEventAction({gaAction: 'table-expand'}));
    }
  }
}
