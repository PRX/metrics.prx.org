import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DownloadsTableModel, RouterParams, CHARTTYPE_EPISODES } from '../ngrx';
import { selectRouter, selectNumEpisodePages,
  selectDownloadTablePodcastDownloads, selectDownloadTableEpisodeMetrics } from '../ngrx/reducers/selectors';
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
    this.podcastTableData$ = this.store.pipe(select(selectDownloadTablePodcastDownloads));
    this.episodeTableData$ = this.store.pipe(select(selectDownloadTableEpisodeMetrics));
    this.numEpisodePages$ = this.store.pipe(select(selectNumEpisodePages));
    this.routerParams$ = this.store.pipe(select(selectRouter));
  }

  toggleChartPodcast(params: {id: string, charted: boolean}) {
    this.store.dispatch(new ACTIONS.ChartTogglePodcastAction({...params}));
  }

  toggleChartEpisode(params: {guid: string, charted: boolean}) {
    this.store.dispatch(new ACTIONS.ChartToggleEpisodeAction({...params}));
  }

  onChartSingleEpisode(guid: string) {
    this.store.dispatch(new ACTIONS.ChartSingleEpisodeAction({guid}));
    this.store.dispatch(new ACTIONS.RouteChartTypeAction({chartType: CHARTTYPE_EPISODES}));
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
