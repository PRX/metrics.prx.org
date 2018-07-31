import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { selectPodcastError } from '../ngrx/reducers/selectors';

@Component({
  selector: 'metrics-home',
  template: `
    <p class="error" *ngIf="error">{{error}}</p>
    <prx-spinner *ngIf="!error" overlay="true" loadingMessage="Please wait..."></prx-spinner>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  error: string;
  podcastsSub: Subscription;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    // The only reason we're on this route is if podcasts have not yet loaded or if the user has no podcasts
    this.podcastsSub = this.store.pipe(select(selectPodcastError)).subscribe((error: any) => {
      this.error = error;
    });
  }

  ngOnDestroy() {
    if (this.podcastsSub) {this.podcastsSub.unsubscribe(); }
  }
}
