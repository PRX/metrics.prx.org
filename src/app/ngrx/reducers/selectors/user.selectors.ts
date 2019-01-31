import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromUser from '../user.reducer';

export const selectUserState = createFeatureSelector<fromUser.State>('user');
export const selectUser = createSelector(selectUserState, fromUser.getUser);
export const selectUserLoggedIn = createSelector(selectUser, user => user && user.loggedIn);
export const selectUserAuthorized = createSelector(selectUser, user => user && user.authorized);
export const selectUserinfo = createSelector(selectUser, user => user && user.userinfo);
export const selectUserdoc = createSelector(selectUser, user => user && user.doc);
export const selectUserError = createSelector(selectUserState, fromUser.getUserError);
