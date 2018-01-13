import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IntervalModel } from '../../../ngrx';

@Component({
  selector: 'metrics-standard-date-range-dropdown',
  template: `
    <div class="dropdown" [class.open]="open">
      <div class="overlay" (click)="toggleOpen()"></div>
      <div class="dropdown-button" [class.open]="open">
        <button (click)="toggleOpen()" >{{ standardRange }}<span class="down-arrow"></span></button>
      </div>
      <div class="dropdown-content rollout">
        <metrics-standard-date-range
          [standardRange]="standardRange" [interval]="interval"
          (standardRangeChange)="standardRangeChange.emit($event)">
        </metrics-standard-date-range>
        <ul>
          <li>
            <button class="btn-link" (click)="onCustom()">
              Other...
            </button>
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['../dropdown.css', './standard-date-range.component.css', './standard-date-range-dropdown.component.css']
})
export class StandardDateRangeDropdownComponent {
  @Input() standardRange: string;
  @Input() interval: IntervalModel;
  @Output() standardRangeChange = new EventEmitter<string>();
  @Output() custom = new EventEmitter();
  open = false;

  toggleOpen() {
    this.open = !this.open;
  }

  onCustom() {
    this.custom.emit();
    this.toggleOpen();
  }
}
