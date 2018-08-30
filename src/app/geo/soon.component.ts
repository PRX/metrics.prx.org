import { Component, Input } from '@angular/core';
import {GROUPTYPE_GEOCOUNTRY, GROUPTYPE_GEOMETRO, GROUPTYPE_GEOSUBDIV, RouterParams} from '../ngrx';

@Component({
  selector: 'metrics-soon',
  template: `
    <section class="soon"
             [class.geocountry]="routerParams?.group === geocountry"
             [class.geosubdiv]="routerParams?.group === geosubdiv"
             [class.geometro]="routerParams?.group === geometro">
      <div class="filter"></div>
      <span class="text">coming soon</span>
    </section>
  `,
  styleUrls: ['./soon.css']
})

export class SoonComponent {
  @Input() routerParams: RouterParams;
  geocountry = GROUPTYPE_GEOCOUNTRY;
  geosubdiv = GROUPTYPE_GEOSUBDIV;
  geometro = GROUPTYPE_GEOMETRO;
}
