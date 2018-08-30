import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { AccountModel } from '../';

export class CmsAccountAction implements Action {
  readonly type = ActionTypes.CMS_ACCOUNT;

  constructor(public payload = {}) {}
}

export interface CmsAccountSuccessPayload {
  account: AccountModel;
}

export class CmsAccountSuccessAction implements Action {
  readonly type = <string>ActionTypes.CMS_ACCOUNT_SUCCESS;
  constructor(public payload: CmsAccountSuccessPayload) {}
}

export class CmsAccountFailureAction implements Action {
  readonly type = ActionTypes.CMS_ACCOUNT_FAILURE;
  constructor(public payload: any) {}
}
