import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productstatus'
})
export class ProductstatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
