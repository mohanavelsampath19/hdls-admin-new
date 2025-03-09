import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'permissions'
})
export class PermissionsPipe implements PipeTransform {

  transform(available_features: any) {
    if(available_features){
      if(available_features.length ==6 ){
        return 'All';
      }else{
        let permissions:any[] = available_features.map((permission:any)=>permission);
        return permissions.join(', ');
      }
    }else{
      return 'All';
    }
  }

}
