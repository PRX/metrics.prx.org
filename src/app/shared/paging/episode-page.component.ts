import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'metrics-episode-page',
  template: `
    <div *ngIf="currentPage && totalPages" class="pager">
      <button [disabled]="prevDisabled" (click)="pageChange.emit(1)" title="Page 1" class="pager">|&#171;</button>
      <button [disabled]="prevDisabled"
              (click)="pageChange.emit(currentPage - 1)"
              title="Page {{currentPage == 1 ? 1 : currentPage - 1}}"
              class="pager">&#171;</button>
      <button *ngFor="let page of pages"
              [disabled]="page === currentPage" [class.active]="page === currentPage"
              (click)="pageChange.emit(page)"
              class="pager">{{page}}</button>
      <button disabled *ngIf="lastPage > showNumPages" class="pager">of {{lastPage}}</button>
      <button [disabled]="nextDisabled"
              (click)="pageChange.emit(currentPage + 1)"
              title="Page {{currentPage + 1}}"
              class="pager">&#187;</button>
      <button [disabled]="nextDisabled"
              (click)="pageChange.emit(lastPage)"
              title="Page {{lastPage}}"
              class="pager">&#187;|</button>
    </div>
  `,
  styleUrls: ['episode-page.component.css']
})
export class EpisodePageComponent implements OnChanges {
  @Input() currentPage;
  @Input() totalPages;
  @Output() pageChange = new EventEmitter<number>();
  pages: number[];
  showNumPages = 5;
  pagesBegin: number;
  pagesEnd: number;
  lastPage: number;

  ngOnChanges() {
    this.lastPage = Math.floor(this.totalPages);

    if (this.totalPages <= this.showNumPages) {
      this.pagesBegin = 1;
      this.pagesEnd = this.lastPage;
    } else {
      const halfWindow = Math.floor(this.showNumPages / 2);
      if (this.currentPage <= (halfWindow + 1)) {
        this.pagesBegin = 1;
        this.pagesEnd = this.showNumPages;
      } else if ((this.currentPage + halfWindow) >= this.lastPage) {
        this.pagesBegin = this.lastPage - this.showNumPages + 1;
        this.pagesEnd = this.lastPage;
      } else {
        this.pagesBegin = this.currentPage - halfWindow;
        this.pagesEnd = this.currentPage + halfWindow;
      }
    }

    this.pages = [];
    for (let i = this.pagesBegin; i <= this.pagesEnd; i++) {
      this.pages.push(i);
    }
  }

  get prevDisabled(): boolean {
    return this.currentPage === 1 || this.totalPages === 1;
  }

  get nextDisabled(): boolean {
    return this.currentPage === this.lastPage;
  }
}
