import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoNombreApellido'
})
export class FormatoNombreApellidoPipe implements PipeTransform {

  transform(nombre: string, apellido: string) {
  
    return this.formatearCadena(nombre) + ' ' + this.formatearCadena(apellido) + ".";

  }
  formatearCadena(cadena: string) {
    
    cadena = cadena.charAt(0).toUpperCase() + cadena.slice(1).toLowerCase();
    return cadena;
  }
}
