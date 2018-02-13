import { Pipe, PipeTransform } from '@angular/core';

export const largeNumberFormat = (value: number) => {
  return value && !isNaN(value) ? Number(value).toLocaleString(undefined, {useGrouping: true}) : '0';
};

@Pipe({name: 'largeNumber'})
export class LargeNumberPipe implements PipeTransform {
  transform(value: number) {
    return largeNumberFormat(value);
  }
}
