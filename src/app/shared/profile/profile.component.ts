import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PodcastModel, EpisodeModel } from '../../ngrx';

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
            <b class="value">{{podcastDownloadsToday}}</b>
          </div>
          <div class="podstat">
            <p class="label">7 Days</p>
            <b class="value">{{podcastDownloads7day}}</b>
          </div>
        </div>

        <div class="epstats">
          <p>Most Recent</p>
          <button class="btn-link" (click)="episodeClicked()">{{episode?.title || "-"}}</button>
          <p>
            {{episodeDownloadsToday}} Today
            &mdash;
            {{episodeDownloadsAllTime}} All Time
          </p>
        </div>
      </div>

    </div>
  `
})

export class ProfileComponent {

  @Input() podcast: PodcastModel;
  @Input() episode: EpisodeModel;
  @Output() chartEpisode = new EventEmitter<number>();

  // TODO: get the real numbers, formatted as decimals + K/M
  podcastDownloadsToday = '-';
  podcastDownloads7day = '-';
  episodeDownloadsToday = '-';
  episodeDownloadsAllTime = '-';

  episodeClicked() {
    if (this.episode) {
      this.chartEpisode.emit(this.episode.id);
    }
  }

}
