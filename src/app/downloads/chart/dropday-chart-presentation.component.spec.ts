import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SharedModule } from '@app/shared';
import { DropdayChartPresentationComponent } from './dropday-chart-presentation.component';

import { routerParams } from '@testing/downloads.fixtures';
import { METRICSTYPE_DROPDAY, CHARTTYPE_EPISODES, INTERVAL_DAILY } from '@app/ngrx';

describe('DropdayChartPresentationComponent', () => {
  let comp: DropdayChartPresentationComponent;
  let fix: ComponentFixture<DropdayChartPresentationComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DropdayChartPresentationComponent
      ],
      imports: [
        SharedModule
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DropdayChartPresentationComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;

      comp.routerParams = {...routerParams, metricsType: METRICSTYPE_DROPDAY, chartType: CHARTTYPE_EPISODES, interval: INTERVAL_DAILY};
      comp.chartData = [
        {label: 'data 1', color: 'blue', data: [1, 1, 2, 3, 5, 8, 13, 21]},
        {label: 'data 1', color: 'green', data: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]}
      ];
      fix.detectChanges();
    });
  }));

  it('should show x axis label for line chart', () => {
    expect(de.query(By.css('p')).nativeElement.textContent).toEqual('Days since drop');
  });
});
