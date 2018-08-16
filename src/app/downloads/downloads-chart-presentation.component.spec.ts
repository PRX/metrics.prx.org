import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from '../shared';
import { DownloadsChartPresentationComponent } from './downloads-chart-presentation.component';

import { routerParams } from '../../testing/downloads.fixtures';

describe('DownloadsChartPresentationComponent', () => {
  let comp: DownloadsChartPresentationComponent;
  let fix: ComponentFixture<DownloadsChartPresentationComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DownloadsChartPresentationComponent
      ],
      imports: [
        RouterTestingModule,
        SharedModule
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DownloadsChartPresentationComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      comp.routerParams = routerParams;
    });
  }));

  it('should show placeholder when no chart data', () => {
    comp.chartData = null;
    expect(de.query(By.css('.placeholder'))).not.toBeNull();
  });
});
