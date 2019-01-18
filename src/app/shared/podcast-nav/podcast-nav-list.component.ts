import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Podcast } from '../../ngrx';

@Component({
  selector: 'metrics-podcast-nav-list',
  template: `
    <ul>
      <li *ngFor="let podcast of podcasts">
        <button class="btn-link" [class.active]="podcast === selectedPodcast" (click)="onPodcastChange(podcast)">
          {{ podcast.title }}
        </button>
      </li>
    </ul>
  `,
  styleUrls: ['../dropdown/nav-list-dropdown.css']
})
export class PodcastNavListComponent {
  @Input() selectedPodcast: Podcast;
  @Input() podcasts: Podcast[];
  @Output() podcastChange = new EventEmitter<Podcast>();

  onPodcastChange(val: Podcast) {
    if (val && (!this.selectedPodcast || val.id !== this.selectedPodcast.id)) {
      this.podcastChange.emit(val);
    }
  }
}
