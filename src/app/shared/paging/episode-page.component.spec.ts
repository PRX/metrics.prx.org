import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, ViewChild } from '@angular/core';

import { EpisodePageComponent } from './episode-page.component';

@Component({
  selector: 'metrics-test-component',
  template: `<metrics-episode-page
    #paging
    [currentPage]="filter?.page"
    [totalPages]="totalPages"
    (pageChange)="pageChange($event)"
  ></metrics-episode-page>`
})
class TestComponent {
  @ViewChild('paging', { static: true }) pager: EpisodePageComponent;
  filter = { page: 1 };
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
      declarations: [TestComponent, EpisodePageComponent]
    })
      .compileComponents()
      .then(() => {
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

  it('should only show up to showNumPages at a time in a sliding window', () => {
    comp.pager.showNumPages = 5; // known value for this test only
    comp.pager.currentPage = 5;
    fix.detectChanges();
    comp.pager.ngOnChanges();
    // expect visible pages 3 4 *5* 6 7
    expect(comp.pager.pagesBegin).toEqual(3);
    expect(comp.pager.pagesEnd).toEqual(7);
  });
});
