import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bookingstatus'
})
export class BookingstatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    console.log(value)
    let result = '';
    switch(value){
      case 0:
        result = 'Pending';
        break;
      case 1:
        result = 'Approved';
        break;
      case 2:
        result = 'Rejected';
        break;
      case 3:
        result = 'Completed';
        break;
    }
    return result;
  }

}
