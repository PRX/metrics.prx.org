import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FilterModel, IntervalModel,
  INTERVAL_MONTHLY, INTERVAL_WEEKLY, INTERVAL_DAILY, INTERVAL_HOURLY } from '../../ngrx';
import * as dateUtil from '../util/date';

@Component({
  selector: 'metrics-interval-dropdown',
  template: `
    <div class="dropdown" [class.open]="open">
      <div class="overlay" (click)="toggleOpen()"></div>
      <div class="dropdown-button" [class.open]="open">
        <button (click)="toggleOpen()" >{{ selectedInterval?.name }}<span class="down-arrow"></span></button>
      </div>
      <div class="dropdown-content rollout">
        <ul>
          <li *ngFor="let interval of intervalOptions">
            <button class="btn-link" [class.active]="interval === selectedInterval" (click)="onIntervalChange(interval)">
              {{ interval.name }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['./dropdown.css', './interval-dropdown.component.css']
})
export class IntervalDropdownComponent implements OnChanges {
  @Input() filter: FilterModel;
  @Output() intervalChange = new EventEmitter<IntervalModel>();
  intervalOptions: IntervalModel[] = [];
  selectedInterval: IntervalModel;
  open = false;


  ngOnChanges() {
    if (this.filter && this.filter.interval && this.filter.beginDate && this.filter.endDate) {
      this.selectedInterval = this.filter.interval;
      this.intervalOptions = this.getIntervalOptions();
    }
  }

  getIntervalOptions(): IntervalModel[] {
    /* API requests limited as follows:
     10 days at 15m
     40 days at 1h
     2.7 years at 1d
     */
    if (dateUtil.isMoreThanXDays(40, this.filter.beginDate, this.filter.endDate)) {
      return [INTERVAL_DAILY, INTERVAL_WEEKLY, INTERVAL_MONTHLY];
    } else {
      return [INTERVAL_HOURLY, INTERVAL_DAILY, INTERVAL_WEEKLY, INTERVAL_MONTHLY];
    }
  }

  toggleOpen() {
    this.open = !this.open;
  }

  onIntervalChange(value: IntervalModel) {
    if (value) {
      this.intervalChange.emit(value);
    }
  }
}
