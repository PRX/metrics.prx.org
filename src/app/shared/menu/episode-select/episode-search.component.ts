import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

@Component({
  selector: 'metrics-episode-search',
  template: `
    <input type="text"
           placeholder="Search for episodes"
           [value]="searchTerm || ''"
           (keyup)="onEpisodeSearch($event.target.value)">
  `,
  styleUrls: ['episode-search.component.css']
})
export class EpisodeSearchComponent implements OnInit {
  @Input() searchTerm: string;
  @Output() search = new EventEmitter<string>();

  searchTextStream = new Subject<string>();

  ngOnInit() {
    this.searchTextStream.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((text: string) => {
        this.search.emit(text);
      });
  }

  onEpisodeSearch(term: string) {
    this.searchTextStream.next(term);
  }
}