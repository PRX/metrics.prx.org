import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { selectEpisodeSelectTotal, selectSelectedEpisodeGuids } from '../../../ngrx/reducers/selectors';
import { EpisodeSelectDropdownService } from './episode-select-dropdown.service';

@Component({
  selector: 'metrics-episode-select',
  template: `
    <metrics-episode-select-dropdown-button
      [totalEpisodes]="totalEpisodes$ | async"
      [selectedEpisodes]="selectedEpisodes$ | async"
      [open]="open"
      (toggleOpen)="toggleOpen($event)">
    </metrics-episode-select-dropdown-button>
  `
})
export class EpisodeSelectComponent implements OnInit {
  totalEpisodes$: Observable<number>;
  selectedEpisodes$: Observable<string[]>;

  constructor(private store: Store<any>,
              private dropdown: EpisodeSelectDropdownService) {}

  ngOnInit() {
    this.totalEpisodes$ = this.store.pipe(select(selectEpisodeSelectTotal));
    this.selectedEpisodes$ = this.store.pipe(select(selectSelectedEpisodeGuids));
  }

  get open(): boolean {
    return this.dropdown.open;
  }

  toggleOpen(open: boolean) {
    this.dropdown.toggleOpen(open);
  }
}
