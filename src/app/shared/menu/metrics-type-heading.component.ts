import { Component, Input } from '@angular/core';
import { RouterModel } from '../../ngrx';

@Component({
  selector: 'metrics-type-heading',
  template: `<h1>{{routerState.metricsType}}</h1>`,
  styleUrls: ['metrics-type-heading.component.css']
})

export class MetricsTypeHeadingComponent {
  @Input() routerState: RouterModel;
}
