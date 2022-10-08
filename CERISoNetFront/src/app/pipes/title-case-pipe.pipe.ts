import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCasePipe'
})
export class TitleCasePipePipe implements PipeTransform {

  transform(value: string): any {
    let temp = value.toLowerCase().split('_');
    temp[0] = temp[0].charAt(0).toUpperCase() + temp[0].slice(1);
    const strValue = temp.join(' ');
    return strValue;
  }

}
