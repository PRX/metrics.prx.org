import { Component, Input } from '@angular/core';
import { RouterParams } from '../../ngrx';

@Component({
  selector: 'metrics-type-heading',
  template: `<h1>{{routerParams.metricsType}}</h1>`,
  styleUrls: ['metrics-type-heading.component.css']
})

export class MetricsTypeHeadingComponent {
  @Input() routerParams: RouterParams;
}
