import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'largeNumber'})
export class LargeNumberPipe implements PipeTransform {
  transform(value: number) {
    return Number(value).toLocaleString(undefined, {useGrouping: true});
  }
}
