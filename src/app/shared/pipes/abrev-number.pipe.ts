import { Pipe, PipeTransform } from '@angular/core';

export const abrevNumberFormat = (value: number) => {
  if (!isNaN(value)) {
    if (value < 1000) {
      return Math.round(value).toString();
    } else if (value < 100000) {
      // when in less than 100 thousand, include 1 decimal place
      return Math.round(value / 100) / 10 + 'K';
    } else {
      // when in 100s of thousands, round
      return Math.round(value / 1000) + 'K';
    }
  }
};

@Pipe({name: 'abrevNumber'})
export class AbrevNumberPipe implements PipeTransform {
  transform(value: number) {
    return abrevNumberFormat(value);
  }
}
