import { Component, Input, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { GroupFilter, RouterParams } from '../../ngrx';

@Component({
  selector: 'metrics-group-filter',
  template: `
    <div class="dropdown" [class.open]="open">
      <div class="overlay" (click)="toggleOpen()"></div>
      <div class="dropdown-button">
        <button (click)="toggleOpen()" >{{ selectedFilter?.label }}<span class="down-arrow"></span></button>
      </div>
      <div class="dropdown-content rollout">
        <ul>
          <li *ngFor="let filter of filterOptions">
            <button class="btn-link" [class.active]="filter === selectedFilter" (click)="onFilterChange(filter)">
              {{ filter.label }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['dropdown.css']
})

export class GroupFilterComponent {
  @Input() routerParams: RouterParams;
  @Input() filterOptions: GroupFilter[];
  @Input() selectedFilter: GroupFilter;
  open = false;
  @HostListener('window: scroll', [])
  onWindowScroll() {
    this.open = false;
  }

  constructor(private store: Store<any>) {}

  toggleOpen() {
    this.open = !this.open;
  }

  onFilterChange(filter: GroupFilter) {
    if (filter && filter !== this.routerParams.filter) {
      this.store.dispatch(new RouteGroupFilterAction({filter}));
    }
    this.toggleOpen();
  }
}
