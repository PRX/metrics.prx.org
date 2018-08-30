import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from '../shared';
import { UserAgentsChartComponent } from './user-agents-chart.component';

import { routerParams } from '../../testing/downloads.fixtures';

describe('UserAgentsChartComponent', () => {
  let comp: UserAgentsChartComponent;
  let fix: ComponentFixture<UserAgentsChartComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserAgentsChartComponent
      ],
      imports: [
        RouterTestingModule,
        SharedModule
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(UserAgentsChartComponent);
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
