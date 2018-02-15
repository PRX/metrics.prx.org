import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'metrics-episode-page',
  template: `
    <div *ngIf="currentPage && totalPages" class="pager">
      <button [disabled]="prevDisabled" (click)="pageChange.emit(1)" title="Page 1" class="btn-link">|&#171;</button>
      <button [disabled]="prevDisabled" title="Page {{currentPage - 1}}" (click)="pageChange.emit(currentPage - 1)" class="btn-link">&#171;</button>
      <button *ngFor="let page of pages | slice:pagesBegin:pagesEnd;"
              [disabled]="page === currentPage" [class.active]="page === currentPage"
              (click)="pageChange.emit(page)"
              class="btn-link">{{page}}</button>
      <button disabled *ngIf="pages.length > showNumPages" class="btn-link">of {{pages.length}}</button>
      <button [disabled]="nextDisabled" (click)="pageChange.emit(currentPage + 1)" title="Page {{currentPage + 1}}" class="btn-link">&#187;</button>
      <button [disabled]="nextDisabled" (click)="pageChange.emit(lastPage)" title="Page {{lastPage}}" class="btn-link">&#187;|</button>
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
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
    this.lastPage = Math.floor(this.totalPages);

    if (this.totalPages <= this.showNumPages) {
      this.pagesBegin = 0;
      this.pagesEnd = this.lastPage - 1;
    }
    else {
      var halfWindow = Math.floor(this.showNumPages / 2);
      if (this.currentPage <= (halfWindow + 1)) {
        this.pagesBegin = 0;
        this.pagesEnd = this.showNumPages;
      }
      else if ((this.currentPage + (halfWindow - 1)) >= this.totalPages) {
        this.pagesBegin = this.totalPages - this.showNumPages;
        this.pagesEnd = this.totalPages;
      }
      else {
        this.pagesBegin = this.currentPage - halfWindow;
        this.pagesEnd = this.currentPage + halfWindow;
      }
    }
  }

  get prevDisabled(): boolean {
    return this.currentPage === 1 || this.totalPages === 1;
  }

  get nextDisabled(): boolean {
    return this.currentPage === this.pages.length;
  }
}
