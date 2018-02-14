import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PodcastModel, EpisodeModel, PodcastPerformanceMetricsModel, EpisodePerformanceMetricsModel } from '../../ngrx';

@Component ({
  selector: 'metrics-profile',
  styleUrls: ['profile.component.css'],
  template: `
    <div class="profile">

      <div class="info">
        <div class="logo">
          <prx-image [imageDoc]="podcast?.doc"></prx-image>
        </div>
        <div class="title">
          <h2>{{podcast?.title}}</h2>
        </div>
      </div>

      <div class="stats">
        <div class="podstats">
          <div class="podstat">
            <p class="label">Today</p>
            <span class="trend-container trend-left">
              <span *ngIf="podcast1DayTrend > 0" class="trend-up"></span>
              <span *ngIf="podcast1DayTrend < 0" class="trend-down"></span>
            </span>
            <b class="value">{{podcastDownloadsToday | abrevNumber}}</b>
          </div>
          <div class="podstat">
            <p class="label">7 Days</p>
            <b class="value">{{podcastDownloads7day | abrevNumber}}</b>
            <span class="trend-container">
              <span *ngIf="podcast7DayTrend > 0" class="trend-up"></span>
              <span *ngIf="podcast7DayTrend < 0" class="trend-down"></span>
            </span>
          </div>
        </div>

        <div class="epstats">
          <p>Most Recent</p>
          <button class="btn-link" (click)="episodeClicked()">{{episode?.title || "-"}}</button>
          <p>
            {{episodeDownloadsToday | abrevNumber}} Today
            &mdash;
            {{episodeDownloadsAllTime | abrevNumber}} All Time
          </p>
        </div>
      </div>

    </div>
  `
})

export class ProfileComponent {

  @Input() podcast: PodcastModel;
  @Input() episode: EpisodeModel;
  @Input() podcastPerformance: PodcastPerformanceMetricsModel;
  @Input() episodePerformance: EpisodePerformanceMetricsModel;
  @Output() chartEpisode = new EventEmitter<number>();

  episodeClicked() {
    if (this.episode) {
      this.chartEpisode.emit(this.episode.id);
    }
  }

  get podcastDownloadsToday(): number {
    return this.podcastPerformance && this.podcastPerformance.today;
  }

  get podcastDownloads7day(): number {
    return this.podcastPerformance && this.podcastPerformance.this7days;
  }

  get episodeDownloadsToday(): number {
    return this.episodePerformance && this.episodePerformance.today;
  }

  get episodeDownloadsAllTime(): number {
    return this.episodePerformance && this.episodePerformance.total;
  }

  get podcast1DayTrend(): number {
    if (this.podcastPerformance) {
      const now = new Date();
      // between midnight and 1am is hour 1 to avoid zeroing out yesterday's number
      return this.podcastPerformance.today - (this.podcastPerformance.yesterday * (now.getHours() + 1) / 24);
    } else {
      return 0;
    }
  }

  get podcast7DayTrend(): number {
    if (this.podcastPerformance) {
      const now = new Date();
      return this.podcastPerformance.this7days - (this.podcastPerformance.previous7days * ((6 * 24) + (now.getHours() + 1)) / (7 * 24));
    } else {
      return 0;
    }
  }
}
