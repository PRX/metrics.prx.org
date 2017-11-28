import { ActionTypes, ActionWithPayload } from './action.types';

export interface GoogleAnalyticsEventPayload {
  gaAction: string;
  category?: string;
  label?: string;
  value?: number;
}

export class GoogleAnalyticsEventAction implements ActionWithPayload<GoogleAnalyticsEventPayload> {
  readonly type = ActionTypes.GOOGLE_ANALYTICS_EVENT;

  constructor(public payload: GoogleAnalyticsEventPayload) {}
}
