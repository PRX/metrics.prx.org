import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ChartTypeComponent } from './chart-type.component';

describe('ChartTypeComponent', () => {
  let comp: ChartTypeComponent;
  let fix: ComponentFixture<ChartTypeComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChartTypeComponent
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(ChartTypeComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;
      fix.detectChanges();

      spyOn(comp.chartTypeChange, 'emit').and.callThrough();
    });
  }));

  it('should emit chart type on button click', () => {
    const buttons = de.queryAll(By.css('button'));
    buttons.forEach(b => b.nativeElement.click());
    expect(comp.chartTypeChange.emit).toHaveBeenCalledTimes(buttons.length);
  });
});
