import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'facilityType'
})
export class FacilityTypePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    let modifiedVal = '';
    switch(value){
      case 'f&b':
        modifiedVal = 'F & B';
        break;
      case 'facility':
        modifiedVal = 'Facilities';
        break;
      case 'marketplace':
        modifiedVal = 'Marketplace / Deal';
        break;
      case 'tourist_places':
        modifiedVal = 'Tourist Places';
        break;
      default:
        modifiedVal='';
    }
    return modifiedVal;
  }

}
