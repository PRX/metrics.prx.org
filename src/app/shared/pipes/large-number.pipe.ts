import { Pipe, PipeTransform } from '@angular/core';

export const largeNumberFormat = (value: any) => {
  if (value !== undefined && value !== null && value !== false && !isNaN(value)) {
    return Number(value).toLocaleString(undefined, {useGrouping: true});
  }
};

@Pipe({name: 'largeNumber'})
export class LargeNumberPipe implements PipeTransform {
  transform(value: number) {
    return largeNumberFormat(value);
  }
}
