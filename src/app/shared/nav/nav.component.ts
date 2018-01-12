import { Component } from '@angular/core';

@Component({
  selector: 'metrics-nav',
  template: `
    <metrics-nav-menu></metrics-nav-menu>
    <ng-content select=".content"></ng-content>
  `,
  styleUrls: ['nav.component.css']
})

export class NavComponent {}
