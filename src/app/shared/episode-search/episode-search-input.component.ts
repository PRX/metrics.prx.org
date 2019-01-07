import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'metrics-episode-search-input',
  template: `
    <input type="text" value="{{searchTerm}}" (change)="onEpisodeSearch($event.target.value)">
  `,
  styleUrls: ['episode-search-input.component.css']
})
export class EpisodeSearchInputComponent {
  @Input() searchTerm: string;
  @Output() search = new EventEmitter<string>();

  onEpisodeSearch(term: string) {
    // TODO: debounce
    this.search.emit(term);
  }
}
