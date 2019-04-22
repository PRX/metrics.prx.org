import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DownloadsTableModel, ChartType, CHARTTYPE_STACKED, CHARTTYPE_PODCAST } from '@app/ngrx';
import * as dateFormat from '@app/shared/util/date/date.format';

@Component({
  selector: 'metrics-downloads-summary-table',
  template: `
    <div class="header row">
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
        <prx-checkbox *ngIf="showEpisodeToggles; else episodeTitle"
          small [checked]="episode.charted" [color]="episode.color"
                      (change)="toggleChartEpisode.emit({guid: episode.id, charted: $event})">
          <span [title]="episode.title">{{episode.title}}</span>
        </prx-checkbox>
        <ng-template #episodeTitle>
          <button class="btn-link title" (click)="chartSingleEpisode.emit(episode.id)" [title]="episode.title">{{episode.title}}</button>
        </ng-template>
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
  @Input() chartType: ChartType;
  @Input() podcastTableData: DownloadsTableModel;
  @Input() episodeTableData: DownloadsTableModel[];
  @Output() toggleChartPodcast = new EventEmitter<{id: string, charted: boolean}>();
  @Output() toggleChartEpisode = new EventEmitter<{episodeId: string, charted: boolean}>();
  @Output() chartSingleEpisode = new EventEmitter<string>();

  releaseDateFormat(date: Date): string {
    return dateFormat.monthDateYear(date);
  }

  get showPodcastToggle(): boolean {
    return this.chartType === CHARTTYPE_STACKED;
  }

  get showEpisodeToggles(): boolean {
    return this.chartType !== CHARTTYPE_PODCAST;
  }
}
