import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PodcastModel } from '../../ngrx';

@Component({
  selector: 'metrics-podcast-dropdown',
  template: `
    <div *ngIf="podcasts?.length > 1" class="dropdown" [class.open]="open">
      <div class="overlay" (click)="toggleOpen()"></div>
      <div class="dropdown-button">
        <button (click)="toggleOpen()" >{{ selectedPodcast?.title }}<span class="down-arrow"></span></button>
      </div>
      <div class="dropdown-content rollout">
        <metrics-podcasts-nav-list
          [selectedPodcast]="selectedPodcast"
          [podcasts]="podcasts"
          (podcastChange)="onPodcastChange($event)">
        </metrics-podcasts-nav-list>
      </div>
    </div>
    <span *ngIf="podcasts?.length === 1 && selectedPodcast">{{ selectedPodcast.title }}</span>
  `,
  styleUrls: ['../menu/dropdown.css', './podcast-nav-dropdown.component.css']
})
export class PodcastNavDropdownComponent {
  @Input() selectedPodcast: PodcastModel;
  @Input() podcasts: PodcastModel[];
  @Output() podcastChange = new EventEmitter<PodcastModel>();
  open = false;

  toggleOpen() {
    this.open = !this.open;
  }

  onPodcastChange(val: PodcastModel) {
    if (val && val.seriesId !== this.selectedPodcast.seriesId) {
      this.toggleOpen();
      this.podcastChange.emit(val);
    }
  }
}
