import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectEpisodeSelectTotal, selectSelectedEpisodeGuids, selectMetricsTypeRoute } from '@app/ngrx/reducers/selectors';
import { EpisodeSelectDropdownService } from './episode-select-dropdown.service';
import { MetricsType } from '@app/ngrx';

@Component({
  selector: 'metrics-episode-select',
  template: `
    <metrics-episode-select-dropdown-button
      [metricsType]="metricsType$ | async"
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
  metricsType$: Observable<MetricsType>;

  constructor(private store: Store<any>,
              private dropdown: EpisodeSelectDropdownService) {}

  ngOnInit() {
    this.totalEpisodes$ = this.store.pipe(select(selectEpisodeSelectTotal));
    this.selectedEpisodes$ = this.store.pipe(select(selectSelectedEpisodeGuids));
    this.metricsType$ = this.store.pipe(select(selectMetricsTypeRoute));
  }

  get open(): boolean {
    return this.dropdown.open;
  }

  toggleOpen(open: boolean) {
    this.dropdown.toggleOpen(open);
  }
}
