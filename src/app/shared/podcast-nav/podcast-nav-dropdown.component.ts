import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Podcast } from '../../ngrx';

@Component({
  selector: 'metrics-podcast-dropdown',
  template: `
    <div *ngIf="podcasts?.length > 1" class="dropdown" [class.open]="open">
      <div class="overlay" (click)="toggleOpen()"></div>
      <div class="dropdown-button">
        <button (click)="toggleOpen()"><span class="button-text">{{selectedPodcast?.title}}</span><span class="down-arrow"></span></button>
      </div>
      <div class="dropdown-content rollout">
        <metrics-podcast-nav-list
          [selectedPodcast]="selectedPodcast"
          [podcasts]="podcasts"
          (podcastChange)="onPodcastChange($event)">
        </metrics-podcast-nav-list>
      </div>
    </div>
    <span class="single button-text" *ngIf="podcasts?.length === 1 && selectedPodcast">{{selectedPodcast?.title}}</span>
  `,
  styleUrls: ['../dropdown/dropdown.css', '../dropdown/nav-dropdown.css']
})
export class PodcastNavDropdownComponent {
  @Input() selectedPodcast: Podcast;
  @Input() podcasts: Podcast[];
  @Output() podcastChange = new EventEmitter<Podcast>();
  open = false;

  toggleOpen() {
    this.open = !this.open;
  }

  onPodcastChange(val: Podcast) {
    if (val && (!this.selectedPodcast || val.id !== this.selectedPodcast.id)) {
      this.toggleOpen();
      this.podcastChange.emit(val);
    }
  }
}
