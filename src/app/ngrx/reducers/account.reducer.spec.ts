import { CmsAccountAction, CmsAccountSuccessAction, CmsAccountFailureAction } from '../actions';
import { AccountReducer, initialState, getAccountEntity, getAccountError } from './account.reducer';

describe('AccountReducer', () => {

  const account = {id: 1234, name: 'Joey JoJo Jr Shabadoo'};

  it('starts loading an account', () => {
    const state = AccountReducer(initialState, new CmsAccountAction());
    expect(state.loading).toEqual(true);
    expect(state.loaded).toEqual(false);
    expect(state.entity).toEqual(null);
  });

  it('successfully loads an account', () => {
    const state = AccountReducer(initialState, new CmsAccountSuccessAction({account}));
    expect(state.loading).toEqual(false);
    expect(state.loaded).toEqual(true);
    expect(state.entity.id).toEqual(1234);
    expect(state.entity.name).toEqual('Joey JoJo Jr Shabadoo');
    expect(getAccountEntity(state).id).toEqual(1234);
  });

  it('fails to load an account', () => {
    const error = 'Something something failed to load';
    const state = AccountReducer(initialState, new CmsAccountFailureAction({error}));
    expect(state.loading).toEqual(false);
    expect(state.loaded).toEqual(false);
    expect(state.entity).toEqual(null);
    expect(state.error).toEqual(error);
    expect(getAccountError(state)).toEqual(error);
  });

});
