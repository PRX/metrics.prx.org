import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { selectPodcasts } from '../ngrx/reducers';
import { PodcastModel } from '../ngrx/model';

@Component({
  selector: 'metrics-home',
  template: `
    <p class="error" *ngIf="error">{{error}}</p>
    <metrics-downloads *ngIf="!error"></metrics-downloads>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  // eventually this will have Tabs+TabService (or whatever else we use because Tab uses BaseModel plus we have mobile requirements)
  error: string;
  podcastsSub: Subscription;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.podcastsSub = this.store.select(selectPodcasts).subscribe((allPodcasts: PodcastModel[]) => {
      if (allPodcasts && allPodcasts.length === 0) {
        this.error = 'Looks like you don\'t have any podcasts.';
      } else {
        this.error = undefined;
      }
    });
  }

  ngOnDestroy() {
    if (this.podcastsSub) {this.podcastsSub.unsubscribe(); }
  }
}
