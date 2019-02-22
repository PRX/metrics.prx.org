import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, EMPTY } from 'rxjs';

export class TestActions extends Actions {
  constructor(source?: Observable<Action>) {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}
