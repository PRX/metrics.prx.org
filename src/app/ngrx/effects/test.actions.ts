import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, EMPTY } from 'rxjs';

/* instanbul ignore next: fake actions for tests */
export class TestActions extends Actions {
  constructor(source?: Observable<Action>) {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    this.source = source;
  }
}
/* instanbul ignore next: fake actions for tests */
export function getActions() {
  return new TestActions();
}
