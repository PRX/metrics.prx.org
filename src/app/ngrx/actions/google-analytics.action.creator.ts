import { createAction, props } from '@ngrx/store';
import { ActionTypes } from './action.types';

export const GoogleAnalyticsEvent = createAction(
  ActionTypes.GOOGLE_ANALYTICS_EVENT,
  props<{ gaAction: string; category?: string; label?: string; value?: number }>()
);
