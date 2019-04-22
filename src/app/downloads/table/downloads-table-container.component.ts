import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DownloadsTableModel, RouterParams, CHARTTYPE_EPISODES } from '@app/ngrx';
import { selectRouter, selectNumEpisodePages,
  selectDownloadTablePodcastDownloads, selectDownloadTableEpisodeMetrics,
  selectDownloadTableIntervalData } from '@app/ngrx/reducers/selectors';
import * as ACTIONS from '@app/ngrx/actions';

@Component({
  selector: 'metrics-downloads-table',
  template: `
    <metrics-downloads-table-presentation
      [totalPages]="numEpisodePages$ | async"
      [podcastTableData]="podcastTableData$ | async"
      [episodeTableData]="episodeTableData$ | async"
      [intervalData]="intervalData$ | async"
      [routerParams]="routerParams$ | async"
      (toggleChartPodcast)="toggleChartPodcast($event)"
      (toggleChartEpisode)="toggleChartEpisode($event)"
      (chartSingleEpisode)="onChartSingleEpisode($event)"
      (pageChange)="onPageChange($event)"
      (toggleExpandedReport)="toggleExpandedReport($event)">
    </metrics-downloads-table-presentation>
  `
})
export class DownloadsTableContainerComponent implements OnInit {
  @Input() totalPages;
  podcastTableData$: Observable<DownloadsTableModel>;
  episodeTableData$: Observable<DownloadsTableModel[]>;
  intervalData$: Observable<any[][]>;
  numEpisodePages$: Observable<number>;
  routerParams$: Observable<RouterParams>;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.podcastTableData$ = this.store.pipe(select(selectDownloadTablePodcastDownloads));
    this.episodeTableData$ = this.store.pipe(select(selectDownloadTableEpisodeMetrics));
    this.intervalData$ = this.store.pipe(select(selectDownloadTableIntervalData));
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

  toggleExpandedReport(expanded) {
    if (expanded) {
      this.store.dispatch(new ACTIONS.GoogleAnalyticsEventAction({gaAction: 'table-expand'}));
    }
  }
}
