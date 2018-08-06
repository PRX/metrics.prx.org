import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DownloadsTableModel, RouterParams, CHARTTYPE_EPISODES } from '../ngrx';
import { selectRouter, selectNumEpisodePages,
  selectDownloadTablePodcastMetrics, selectDownloadTableEpisodeMetrics } from '../ngrx/reducers/selectors';
import * as ACTIONS from '../ngrx/actions';

@Component({
  selector: 'metrics-downloads-table',
  template: `
    <metrics-downloads-table-presentation
      [totalPages]="numEpisodePages$ | async"
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
export class DownloadsTableContainerComponent implements OnInit {
  @Input() totalPages;
  podcastTableData$: Observable<DownloadsTableModel>;
  episodeTableData$: Observable<DownloadsTableModel[]>;
  numEpisodePages$: Observable<number>;
  routerParams$: Observable<RouterParams>;
  expanded = false;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.podcastTableData$ = this.store.pipe(select(selectDownloadTablePodcastMetrics));
    this.episodeTableData$ = this.store.pipe(select(selectDownloadTableEpisodeMetrics));
    this.numEpisodePages$ = this.store.pipe(select(selectNumEpisodePages));
    this.routerParams$ = this.store.pipe(select(selectRouter));
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
