import { Component } from '@angular/core';

@Component({
  selector: 'metrics-placeholder',
  template: `
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 320px;
    }
  `]
})
export class PlaceholderComponent {}
