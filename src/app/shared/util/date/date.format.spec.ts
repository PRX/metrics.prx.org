import * as dateFormat from './date.format';

describe('date format', () => {
  it('should format dates in UTC', () => {
    const date = new Date();
    let utcString = dateFormat.UTCString(date);
    const search = utcString.match(/..:..:../);
    expect(parseInt(utcString.slice(search.index, search.index + 2), 10)).toEqual(date.getUTCHours());
    utcString = dateFormat.dayOfWeek(date);
    expect(parseInt(utcString.slice(utcString.lastIndexOf(' ') + 1), 10)).toEqual(date.getUTCDate());
    utcString = dateFormat.monthDate(date);
    expect(parseInt(utcString.slice(utcString.indexOf(' ') + 1), 10)).toEqual(date.getUTCDate());
    utcString = dateFormat.monthDateYear(date);
    expect(parseInt(utcString.slice(utcString.indexOf(' ') + 1), 10)).toEqual(date.getUTCDate());
    utcString = dateFormat.monthYear(date);
    expect(parseInt(utcString.slice(utcString.indexOf(' ') + 1), 10)).toEqual(date.getUTCFullYear());
  });

  it('should format hourly dates in local timezone', () => {
    const date = new Date();
    date.setMinutes(0);
    const dateString = dateFormat.hourly(date);
    let hours;
    if (date.getHours() === 0) {
      hours = 12;
    } else if (date.getHours() > 12) {
      hours = date.getHours() % 12;
    } else {
      hours = date.getHours();
    }
    expect(parseInt(dateString.slice(dateString.indexOf(', ') + 1), 10)).toEqual(hours);
  });

  it('should round hourly date format to the nearest hour', () => {
    const date = new Date();
    date.setMinutes(39);
    const dateString = dateFormat.hourly(date);
    let hours;
    const roundedHours = date.getMinutes() > 30 ? (date.getHours() + 1) % 24 : date.getHours();
    if (roundedHours === 0) {
      hours = 12;
    } else if (roundedHours > 12) {
      hours = roundedHours % 12;
    } else {
      hours = roundedHours;
    }
    expect(parseInt(dateString.slice(dateString.indexOf(', ') + 1), 10)).toEqual(hours);
  });
});
