import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dia'
})
export class DiaPipe implements PipeTransform {
  transform(dia : number)
  {
    let diaNombre;
    switch (dia) {
      case 1:
        diaNombre = "Lunes";
        break;
      case 2:
        diaNombre = "Martes";
        break;
      case 3:
        diaNombre = "Miércoles";
        break;
      case 4:
        diaNombre = "Jueves";
        break;
      case 5:
        diaNombre = "Viernes";
        break;
      case 6:
        diaNombre = "Sábado";
        break;
    }

    return diaNombre;
  }

}
