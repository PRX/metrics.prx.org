import { INTERVAL_DAILY, INTERVAL_HOURLY, INTERVAL_15MIN } from '../model/';

export const subtractDatasets = (from: any[][], datasets: any[][][]) => {
  // assuming that datasets have been unsparsed and are limited by the same filter begin/end dates
  // there is no effort here to line up the datasets by datetime because it's assumed that they already are lined up
  // may want to reconsider this in the future if we need to cache extra data outside the filter to support interactive zooming on the chart
  const subtracted = [];
  for (let i = 0; i < from.length; i++) {
    let total = 0;
    datasets.forEach(data => total += data[i][1]);
    subtracted.push([from[i][0], from[i][1] - total]);
  }
  return subtracted;
};
