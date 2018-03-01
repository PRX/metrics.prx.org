import { createSelector } from '@ngrx/store';
import { RootState, selectAppState } from '../';
import { getAccountEntity, getAccountError } from '../account.reducer';

export const selectAccountState = createSelector(selectAppState, (state: RootState) => state.account);
export const selectAccount = createSelector(selectAccountState, getAccountEntity);
export const selectAccountError = createSelector(selectAccountState, getAccountError);
