import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
export class EpisodeSearchComponent implements OnInit, OnDestroy {
  @Input() searchTerm: string;
  @Output() search = new EventEmitter<string>();

  searchTextStream = new Subject<string>();
  searchTextSub: Subscription;

  ngOnInit() {
    this.searchTextSub = this.searchTextStream.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      this.search.emit(text);
    });
  }

  ngOnDestroy() {
    if (this.searchTextSub) {
      this.searchTextSub.unsubscribe();
    }
  }

  onEpisodeSearch(term: string) {
    this.searchTextStream.next(term);
  }
}
