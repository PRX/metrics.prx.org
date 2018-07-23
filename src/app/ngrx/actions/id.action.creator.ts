import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { AccountModel } from '../';

export class IdAccountLoadAction implements Action {
  readonly type = ActionTypes.ID_ACCOUNT_LOAD;

  constructor(public payload = {}) {}
}

export interface IdAccountSuccessPayload {
  account: AccountModel;
}

export class IdAccountSuccessAction implements Action {
  readonly type = <string>ActionTypes.ID_ACCOUNT_SUCCESS;

  constructor(public payload: IdAccountSuccessPayload) {}
}

export class IdAccountFailureAction implements Action {
  readonly type = ActionTypes.ID_ACCOUNT_FAILURE;

  constructor(public payload: any) {}
}
