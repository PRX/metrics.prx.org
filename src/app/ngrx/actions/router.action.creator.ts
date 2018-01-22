import { Action } from '@ngrx/store';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { RouterModel } from '../';

export interface CustomRouterNavigationPayload {
  event?: any; // type is RoutesRecognized but only used by Angular, typed any so can be mocked
  routerState: RouterModel;
}

export class CustomRouterNavigationAction implements Action {
  readonly type = ROUTER_NAVIGATION;

  constructor(public payload: CustomRouterNavigationPayload) {}
}
