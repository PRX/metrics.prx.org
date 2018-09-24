import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Env } from '../core/core.env';
import { GROUPTYPE_GEOCOUNTRY, GROUPTYPE_GEOMETRO, RouterParams } from '../ngrx/index';

declare const google: any;

@Component({
  selector: 'metrics-geochart-map',
  template: `<div #geo></div>`
})

export class GeochartMapComponent implements OnInit, OnChanges {
  private static googleLoaded: boolean;
  @ViewChild('geo') el: ElementRef;
  @Input() routerParams: RouterParams;
  @Input() data: any[][];
  @Input() nestedData: any[][];
  colors = ['#e5f5fb', '#a6cee3', '#01a0dc', '#008fc5', '#0089bd', '#1f78b4'];

  ngOnInit() {
    if (!GeochartMapComponent.googleLoaded && Env.GOOGLE_API_KEY) {
      GeochartMapComponent.googleLoaded = true;
      google.charts.load('current', {
        packages: ['geochart'],
        mapsApiKey: Env.GOOGLE_API_KEY
      });
      google.charts.setOnLoadCallback(this.drawMap.bind(this));
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (GeochartMapComponent.googleLoaded && google.visualization && this.data && changes.data) {
      this.drawMap();
    }
  }

  drawMap() {
    const options = {
      displayMode: 'region',
      colorAxis: {colors: this.colors},
      legend: 'none',
      height: 320
    };

    let data;
    /* TODO: other regions are not working yet, need to use region codes and format rows for displaying name,
    see https://developers.google.com/chart/interactive/docs/reference#DataTable
    if (this.routerParams.group === GROUPTYPE_GEOCOUNTRY && this.routerParams.filter && this.nestedData) {
      options['region'] = this.routerParams.filter;
      options['resolution'] = 'provinces';
      data = google.visualization.arrayToDataTable(this.nestedData);
    } else */if (this.routerParams.group === GROUPTYPE_GEOCOUNTRY) {
      options['region'] = 'world';
      data = google.visualization.arrayToDataTable(this.data);
    } else if (this.routerParams.group === GROUPTYPE_GEOMETRO) {
      options['region'] = 'US';
      options['resolution'] = 'metros';
      data = google.visualization.arrayToDataTable(this.data);
    }

    const chart = new google.visualization.GeoChart(this.el.nativeElement);
    chart.draw(data, options);
  }
}
