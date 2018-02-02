import { Pipe, PipeTransform } from '@angular/core';

export const largeNumberFormat = (value: number) => {
  return Number(value).toLocaleString(undefined, {useGrouping: true});
};

@Pipe({name: 'largeNumber'})
export class LargeNumberPipe implements PipeTransform {
  transform(value: number) {
    return largeNumberFormat(value);
  }
}
