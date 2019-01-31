import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { User } from '..';

export class IdUserinfoLoadAction implements Action {
  readonly type = ActionTypes.ID_USERINFO_LOAD;

  constructor(public payload = {}) {}
}

export interface IdUserinfoSuccessPayload {
  user: User;
}

export class IdUserinfoSuccessAction implements Action {
  readonly type = <string>ActionTypes.ID_USERINFO_SUCCESS;
  constructor(public payload: IdUserinfoSuccessPayload) {}
}

export class IdUserinfoFailureAction implements Action {
  readonly type = ActionTypes.ID_USERINFO_FAILURE;
  constructor(public payload: any) {}
}
