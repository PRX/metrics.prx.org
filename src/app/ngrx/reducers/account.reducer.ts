import { ActionTypes, CmsAccountSuccessAction, CmsAccountFailureAction, AllActions } from '../actions';
import { HalDoc } from 'ngx-prx-styleguide';

export interface AccountModel {
  doc?: HalDoc;
  id: number;
  name: string;
}

export interface AccountState {
  entity: AccountModel;
  loaded: boolean;
  loading: boolean;
  error?: any;
}

export const initialState = {
  entity: null,
  loaded: false,
  loading: false
};

const accountEntity = (state: AccountState, account: AccountModel): AccountModel => {
  return account;
};

export function AccountReducer(state: AccountState = initialState, action: AllActions): AccountState {
  switch (action.type) {
    case ActionTypes.CMS_ACCOUNT: {
      return {
        ...state,
        entity: null,
        loading: true,
        loaded: false
      };
    }
    case ActionTypes.CMS_ACCOUNT_SUCCESS:
      if (action instanceof CmsAccountSuccessAction) {
        return {
          entity: action.payload.account,
          loading: false,
          loaded: true
        };
      }
      break;
    case ActionTypes.CMS_ACCOUNT_FAILURE: {
      if (action instanceof CmsAccountFailureAction) {
        return {
          ...state,
          error: action.payload.error,
          entity: null,
          loading: false,
          loaded: false
        };
      }
      break;
    }
  }
  return state;
}

export const getAccountEntity = (state: AccountState) => state.entity;
export const getAccountError = (state: AccountState) => state.error;
