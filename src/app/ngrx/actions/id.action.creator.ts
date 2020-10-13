import { createAction, props } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { User } from '..';

export const IdUserinfoLoad = createAction(ActionTypes.ID_USERINFO_LOAD);

export const IdUserinfoSuccess = createAction(ActionTypes.ID_USERINFO_SUCCESS, props<{ user: User }>());

export const IdUserinfoFailure = createAction(ActionTypes.ID_USERINFO_FAILURE, props<{ error }>());
