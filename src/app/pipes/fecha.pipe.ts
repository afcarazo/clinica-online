import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {
  transform(fechaArray : string[])
  {
    let arrayRetorno = [];
    for (let fecha of fechaArray) 
    {
      let fechaConvertida = [];
      let fechaConvertida2 = [];
      let fechaASubir = "";
      
      fechaConvertida2 = fecha.split(',');
      fechaConvertida = fechaConvertida2[1].split(' ');

      fechaConvertida2[0] = this.cambiarDia(fechaConvertida2[0]);
      fechaConvertida[1] = this.cambiarMes(fechaConvertida[1]);

      fechaASubir = fechaConvertida2[0] + " " + fechaConvertida[0] + "/" + fechaConvertida[1] + "/" + fechaConvertida[2];
      arrayRetorno.push(fechaASubir);
    }

    return arrayRetorno;
  }
  cambiarDia(dia : string)
  {
    switch (dia) {
      case "Mon":
        dia = "Lunes";
        break;
      case "Tue":
        dia = "Martes";
        break;
      case "Wed":
        dia = "Miércoles";
        break;
      case "Thu":
        dia = "Jueves";
        break;
      case "Fri":
        dia = "Viernes";
        break;
      case "Sat":
        dia = "Sábado";
        break;
    }

    return dia;
  }

  cambiarMes(mes : any)
  {
    switch (mes) {
      case "Jan":
        mes = "01";
        break;
      case "Feb":
        mes = "02";
        break;
      case "Mar":
        mes = "03";
        break;
      case "Apr":
        mes = "04";
        break;
      case "May":
        mes = "05";
        break;
      case "Jun":
        mes = "06";
        break;
      case "Jul":
        mes = "07";
        break;
      case "Aug":
        mes = "08";
        break;
      case "Sep":
        mes = "09";
        break;
      case "Oct":
        mes = "10";
        break;
      case "Nov":
        mes = "11";
        break;
      case "Dec":
        mes = "12";
        break;
    }

    return mes;
  }


}
