import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DownloadsTableModel,
  MetricsType, METRICSTYPE_DOWNLOADS,
  ChartType, CHARTTYPE_STACKED, CHARTTYPE_PODCAST } from '@app/ngrx';
import * as dateFormat from '@app/shared/util/date/date.format';

@Component({
  selector: 'metrics-downloads-summary-table',
  template: `
    <div class="header row" *ngIf="podcastTableData || (episodeTableData && episodeTableData.length)">
      <div>Episode</div>
      <div>Release Date</div>
      <div class="charted">Downloads</div>
      <div>All-Time</div>
    </div>

    <div class="row" *ngIf="podcastTableData">
      <div>
        <prx-checkbox *ngIf="showPodcastToggle; else podcastTitle"
          small [checked]="podcastTableData.charted" [color]="podcastTableData.color"
          (change)="toggleChartPodcast.emit($event)">
          {{podcastTableData.title}}
        </prx-checkbox>
        <ng-template #podcastTitle><span class="title">{{podcastTableData.title}}</span></ng-template>
        <!-- responsive table only ever shows title -->
        <span class="mobile-label title">{{podcastTableData.title}}</span>
      </div>
      <div></div>
      <div class="charted"><span class="mobile-label">Downloads: </span>{{podcastTableData.totalForPeriod | largeNumber}}</div>
      <div *ngIf="podcastTableData.allTimeDownloads !== undefined">
        <span class="mobile-label">All-time downloads: </span>{{podcastTableData.allTimeDownloads | largeNumber}}
      </div>
    </div>

    <div class="row" *ngFor="let episode of episodeTableData">
      <div>
        <ng-container [ngSwitch]="episodeTitleType">
          <prx-checkbox *ngSwitchCase="checkbox"
            small [checked]="episode.charted" [color]="episode.color"
            (change)="toggleChartEpisode.emit({guid: episode.id, charted: $event})">
            <span [title]="episode.title">{{episode.title}}</span>
          </prx-checkbox>
          <button *ngSwitchCase="button"
            class="btn-link title" (click)="chartSingleEpisode.emit(episode.id)" [title]="episode.title">
            {{episode.title}}
          </button>
          <div *ngSwitchDefault class="title plain-title">
            <span class="legend" [style.background-color]="episode.color"></span>
            <span class="label" [title]="episode.title">{{episode.title}}</span>
          </div>
        </ng-container>
        <!-- responsive table only ever shows title, no prx-checkbox or .btn-link -->
        <span class="mobile-label title">{{episode.title}}</span>
      </div>
      <div><span class="mobile-label">Release date: </span>{{releaseDateFormat(episode.publishedAt)}}</div>
      <div class="charted"><span class="mobile-label">Downloads: </span>{{episode.totalForPeriod | largeNumber}}</div>
      <div *ngIf="episode.allTimeDownloads !== undefined">
        <span class="mobile-label">All-time downloads: </span>{{episode.allTimeDownloads | largeNumber}}
      </div>
    </div>
  `,
  styleUrls: ['summary-table.component.css']
})
export class SummaryTableComponent {
  @Input() metricsType: MetricsType;
  @Input() chartType: ChartType;
  @Input() podcastTableData: DownloadsTableModel;
  @Input() episodeTableData: DownloadsTableModel[];
  @Output() toggleChartPodcast = new EventEmitter<{id: string, charted: boolean}>();
  @Output() toggleChartEpisode = new EventEmitter<{guid: string, charted: boolean}>();
  @Output() chartSingleEpisode = new EventEmitter<string>();
  checkbox = 'checkbox';
  button = 'button';

  releaseDateFormat(date: Date): string {
    return dateFormat.monthDateYear(date);
  }

  get isDownloads(): boolean {
    return this.metricsType === METRICSTYPE_DOWNLOADS;
  }

  get showPodcastToggle(): boolean {
    return this.isDownloads && this.chartType === CHARTTYPE_STACKED;
  }

  get episodeTitleType(): string {
    if (this.isDownloads && this.chartType !== CHARTTYPE_PODCAST) {
      return this.checkbox;
    } else if (this.isDownloads && this.chartType === CHARTTYPE_PODCAST) {
      return this.button;
    } else {
      return '';
    }
  }
}
