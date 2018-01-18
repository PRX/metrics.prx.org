import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DownloadsSummaryItemComponent } from './downloads-summary-item.component';
import { LargeNumberPipe } from '../pipes/large-number.pipe';

describe('DownloadsSummaryItemComponent', () => {
  let comp: DownloadsSummaryItemComponent;
  let fix: ComponentFixture<DownloadsSummaryItemComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DownloadsSummaryItemComponent,
        LargeNumberPipe
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DownloadsSummaryItemComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should show label', () => {
    comp.label = 'some data';
    fix.detectChanges();
    expect(de.query(By.css(.label)).nativeElement.innerText).toEqual('some data');
  });

  it('should show value', () => {
    comp.value = 1234567;
    fix.detectChanges();
    expect(de.query(By.css('.value')).nativeElement.innerText).toEqual(LargeNumberPipe.transform(1234567));
  });
});
