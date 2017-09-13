import { FilterModel } from '../model/filter.model';
import { INTERVAL_DAILY, INTERVAL_HOURLY, INTERVAL_15MIN } from '../model';

export const unsparseDataset = (filter: FilterModel, dataset: any[][]) => {
  // yes, this is generating dates here which might be concerning, but it is still a deterministic/pure function
  const unsparsed = [];
  // TODO: probably need to normalize this to the interval, if daily begin at 0:0:0
  // --> datetime controls
  const datetime = new Date(filter.beginDate.valueOf());
  while (datetime.valueOf() <= filter.endDate.valueOf()) {
    const data = dataset.find(d => new Date(d[0]).valueOf() === datetime.valueOf());
    if (data) {
      unsparsed.push(data);
    } else {
      unsparsed.push([datetime.toISOString(), 0]);
    }
    switch (filter.interval) {
      case INTERVAL_DAILY:
        datetime.setDate(datetime.getDate() + 1);
        break;
      case INTERVAL_HOURLY:
        datetime.setHours(datetime.getHours() + 1);
        break;
      case INTERVAL_15MIN:
        datetime.setMinutes(datetime.getMinutes() + 15);
        break;
    }
  }
  return unsparsed;
};


export const subtractDataset = (from: any[][], dataset: any[][]) => {
  // assuming that datasets have been unsparsed and are limited by the same filter begin/end dates
  // there is no effort here to line up the datasets by datetime because it's assumed that they already are lined up
  // may want to reconsider this in the future if we need to cache extra data outside the filter to support interactive zooming on the chart
  const subtracted = [];
  for (let i = 0; i < from.length; i++) {
    subtracted.push([from[i][0], from[i][1] - dataset[i][1]]);
  }
  return subtracted;
};
