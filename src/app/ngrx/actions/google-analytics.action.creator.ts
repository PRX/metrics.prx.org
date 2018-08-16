import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';

export interface GoogleAnalyticsEventPayload {
  gaAction: string;
  category?: string;
  label?: string;
  value?: number;
}

export class GoogleAnalyticsEventAction implements Action {
  readonly type = <string>ActionTypes.GOOGLE_ANALYTICS_EVENT;

  constructor(public payload: GoogleAnalyticsEventPayload) {}
}
