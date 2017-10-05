import * as moment from 'moment';

export const isMoreThanXDays = (x: number, beginDate, endDate): boolean => {
  return endDate.valueOf() - beginDate.valueOf() > (1000 * 60 * 60 * 24 * x); // x days
};

export const beginningOfTodayUTC = () => {
  return moment().utc().hours(0).minutes(0).seconds(0).milliseconds(0);
};

export const endOfTodayUTC = () => {
  return moment().utc().hours(23).minutes(59).seconds(59).milliseconds(999);
};
