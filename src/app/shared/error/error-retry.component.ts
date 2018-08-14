import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AllActions } from '../../ngrx/actions/index';

@Component({
  selector: 'metrics-error-retry',
  template: `
    <section *ngIf="retryActions?.length">
      <p class="error">Something went wrong with loading metrics data. Click 'Retry' to try again.</p>
      <button class="button" (click)="retry()">Retry</button>
    </section>
  `,
  styleUrls: ['error-retry.component.css']
})
export class ErrorRetryComponent {
  @Input() retryActions: AllActions[];

  constructor(private store: Store<any>) {}

  retry() {
    this.retryActions.forEach(action => this.store.dispatch(action));
  }
}
