import * as moment from 'moment';

export const UTCString = (date: Date): string => {
  return date.toUTCString();
};

export const dayOfWeek = (date: Date | moment.Moment): string => {
  return moment(date).utc().format('ddd MMM D');
};

export const monthDate = (date: Date | moment.Moment): string => {
  return  moment(date).utc().format('MMM D');
};

export const monthDateYear = (date: Date | moment.Moment, separator = true): string => {
  if (separator) {
    return moment(date).utc().format('MMM D, YYYY');
  } else {
    return moment(date).utc().format('MMM D YYYY');
  }
};

export const monthYear = (date: Date): string => {
  return moment(date).utc().format('MMM YYYY');
};

export const hourly = (date: Date): string => {
  return date.getMinutes() < 30 ?
    moment(date).format('MMM D, h:00 A') :
    moment(date).add(1, 'hours').format('MMM D, h:00 A');
};

export const ISODate = (date: Date, separator = '-'): string => {
  return moment(date).utc().format(`YYYY${separator}MM${separator}DD`);
};

export const defaultTZ = (date: Date): string => {
  return moment(date).format();
};
