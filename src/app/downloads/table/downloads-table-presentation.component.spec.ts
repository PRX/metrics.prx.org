import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FancyFormModule } from 'ngx-prx-styleguide';

import { SharedModule } from '../../shared';
import { DownloadsTablePresentationComponent } from './downloads-table-presentation.component';
import { ScrollingTableComponent } from './scrolling-table.component';
import { SummaryTableComponent } from './summary-table.component';

import { INTERVAL_HOURLY } from '../../ngrx/reducers/models';
import { routerParams } from '../../../testing/downloads.fixtures';

describe('DownloadsTablePresentationComponent', () => {
  let comp: DownloadsTablePresentationComponent;
  let fix: ComponentFixture<DownloadsTablePresentationComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DownloadsTablePresentationComponent,
        ScrollingTableComponent,
        SummaryTableComponent
      ],
      imports: [
        RouterTestingModule,
        FancyFormModule,
        SharedModule
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DownloadsTablePresentationComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should show message about local timezone translation for hourly data', () => {
    comp.routerParams = {...routerParams, interval: INTERVAL_HOURLY};
    fix.detectChanges();
    expect(de.query(By.css('em')).nativeElement.textContent).toContain('local timezone');
  });
});
