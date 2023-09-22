import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoDni'
})
export class FormatoDniPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    let aux = value.toString().split('');

    if(aux.length === 7)
    {
      return aux[0] + '.' + aux[1]  + aux[2] + aux[3] + '.' + aux[4] + aux[5] + aux[6]
    }
    else
    {
      return aux[0] + aux[1] + '.' + aux[2] + aux[3] + aux[4] + '.' + aux[5] + aux[6] + aux[7];
    }
  }

}
