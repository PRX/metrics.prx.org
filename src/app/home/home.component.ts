import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectPodcastError } from '../ngrx/reducers/selectors';

@Component({
  selector: 'metrics-home',
  template: `
    <p class="error" *ngIf="error$ | async">{{error}}</p>
    <prx-spinner *ngIf="!(error$ | async)" overlay="true" loadingMessage="Please wait..."></prx-spinner>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  error$: Observable<string>;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    // The only reason we're on this route is if podcasts have not yet loaded or if the user has no podcasts
    this.error$ = this.store.pipe(select(selectPodcastError));
  }
}
