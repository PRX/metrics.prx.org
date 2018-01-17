import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PodcastModel } from '../../ngrx';

@Component({
  selector: 'metrics-podcasts-nav-list',
  template: `
    <ul>
      <li *ngFor="let podcast of podcasts">
        <button class="btn-link" [class.active]="podcast === selectedPodcast" (click)="onPodcastChange(podcast)">
          {{ podcast.title }}
        </button>
      </li>
    </ul>
  `
})
export class PodcastNavListComponent {
  @Input() selectedPodcast: PodcastModel;
  @Input() podcasts: PodcastModel[];
  @Output() podcastChange = new EventEmitter<PodcastModel>();

  onPodcastChange(val) {
    if (val && val.seriesId !== this.selectedPodcast.seriesId) {
      this.podcastChange.emit(val);
    }
  }
}
