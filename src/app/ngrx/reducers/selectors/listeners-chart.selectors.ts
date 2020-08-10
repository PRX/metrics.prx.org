import { createSelector } from '@ngrx/store';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { selectRoutedPodcastListeners } from './podcast-listeners.selectors';
import { selectIntervalRoute } from './router.selectors';
import { PodcastListeners, IntervalModel, INTERVAL_LASTWEEK, INTERVAL_LAST28DAYS } from '../models';
import { mapMetricsToTimeseriesData, standardColor } from '@app/shared/util/chart.util';

export const selectListenersChartMetrics = createSelector(
  selectIntervalRoute,
  selectRoutedPodcastListeners,
  (intervalRoute: IntervalModel, routedPodcastData: PodcastListeners): TimeseriesChartModel[] => {
    if (routedPodcastData && routedPodcastData.listeners) {
      return [
        {
          label: 'Unique Listeners',
          data: mapMetricsToTimeseriesData(routedPodcastData.listeners),
          color: standardColor
        }
      ];
    }
  }
);
