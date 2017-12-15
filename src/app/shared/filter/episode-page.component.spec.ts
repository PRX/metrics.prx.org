import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, ViewChild } from '@angular/core';

import { EpisodePageComponent } from './episode-page.component';

@Component({
  selector: 'test-component',
  template: `<metrics-episode-page #paging
              [currentPage]="filter?.page"
              [totalPages]="totalPages"
              (pageChange)="pageChange($event)"></metrics-episode-page>`
})
class TestComponent {
  @ViewChild('paging') pager: EpisodePageComponent;
  filter = {page: 1};
  totalPages = 8;
  pageChange(page: number) {
    this.filter.page = page;
  }
}

describe('EpisodePageComponent', () => {
  let comp: TestComponent;
  let fix: ComponentFixture<TestComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        EpisodePageComponent
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(TestComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should disable prev button if on page 1', () => {
    expect(comp.pager.prevDisabled).toBeTruthy();
  });

  it('should disable next button if on last page', () => {
    comp.pager.currentPage = 8;
    fix.detectChanges();
    expect(comp.pager.nextDisabled).toBeTruthy();
  });

  it('should disabled next and prev buttons if there is only one page', () => {
    comp.pager.currentPage = 1;
    comp.pager.totalPages = 1;
    fix.detectChanges();
    comp.pager.ngOnChanges();
    expect(comp.pager.prevDisabled).toBeTruthy();
    expect(comp.pager.nextDisabled).toBeTruthy();
  });

  it('should only show up to showNumPages at a time', () => {
    comp.pager.currentPage = 5;
    comp.pager.totalPages = 2 * comp.pager.showNumPages;
    fix.detectChanges();
    expect(comp.pager.pagesEnd).toEqual(10);
  });
});
