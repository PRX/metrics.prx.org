import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { GeoChartComponent } from './geo-chart.component';
import { SharedModule } from '../shared';

describe('GeochartMapComponent', () => {
  let comp: GeoChartComponent;
  let fix: ComponentFixture<GeoChartComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GeoChartComponent
      ],
      imports: [
        SharedModule
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(GeoChartComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should redraw map on window resize', () => {
    comp.chartData = [
      {
        color: '#ff7f00',
        data: [
          {value: 246852, date: 1537488000000},
          {value: 1307360, date: 1537660800000},
          {value: 1446363, date: 1538265600000},
          {value: 1585948, date: 1538870400000},
          {value: 1016239, date: 1539475200000}
        ],
        label: 'United States'
      }
    ];
    fix.detectChanges();
    expect(de.query(By.css('prx-timeseries-chart'))).not.toBeNull();
  });
});
