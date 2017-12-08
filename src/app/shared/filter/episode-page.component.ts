import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'metrics-episode-page',
  template: `
    <div *ngIf="currentPage && totalPages">
      <button [disabled]="currentPage === 1 || totalPages === 1" (click)="pageChange.emit(currentPage - 1)" class="btn-link">&lt;</button>
      <button *ngFor="let page of pages | slice:pagesBegin:pagesEnd;"
              [disabled]="page === currentPage" [class.active]="page === currentPage"
              (click)="pageChange.emit(page)"
              class="btn-link">{{page}}</button>
      <button disabled *ngIf="pages.length > showNumPages" class="btn-link">of {{pages.length}}</button>
      <button [disabled]="currentPage === pages.length" (click)="pageChange.emit(currentPage + 1)" class="btn-link">&gt;</button>
    </div>
  `,
  styleUrls: ['episode-page.component.css']
})
export class EpisodePageComponent implements OnChanges {
  @Input() currentPage;
  @Input() totalPages;
  @Output() pageChange = new EventEmitter<number>();
  pages: number[];
  showNumPages = 10;
  pagesBegin: number;
  pagesEnd: number;

  ngOnChanges() {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
    this.pagesBegin = this.showNumPages * Math.floor((this.currentPage - 1) / this.showNumPages);
    this.pagesEnd = this.showNumPages * Math.ceil(this.currentPage / this.showNumPages);
  }
}
