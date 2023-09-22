import { Component, OnInit } from '@angular/core';
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  LinearScale,
  registerables,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as fileSaver from 'file-saver';
import { FirestoreService } from 'src/app/services/firestore.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {
  listadoTurnos: any[] = [];
  logs: any[] = [];
  listadoEspecialistas: any[] = [];
  listadoEspecialidades: any[] = [];
  spinner: boolean = false;
  mostrarLogs: boolean = false;

  constructor(private firestoreService: FirestoreService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.firestoreService.traerTurnos().subscribe(value => {
      this.listadoTurnos = value;
    });
    this.firestoreService.traerListadoEspecilidades().subscribe(value => {
      this.listadoEspecialidades = value;
    });
    this.firestoreService.traerListadoAEspecialistas().subscribe(value => {
      this.listadoEspecialistas= value;
    });
    this.firestoreService.traerLogs().subscribe(value => {
      this.logs= value;
    });
    this.spinner = true;
    setTimeout(() => {
      this.generarChartTurnosPorEspecialidad();
      this.generarChartTurnosPorDias();
      this.generarChartTurnosSolicitadoMedico();
      this.generarChartTurnosFinalizadoMedico();
      this.spinner = false;
    }, 4000);


  }


  generarChartTurnosPorEspecialidad() {
    this.spinner = true;
    setTimeout(() => {
      const ctx = (<any>document.getElementById('graficoPorEspecialidad')).getContext(
        '2d'
      );

      let nombresEspecialidades: any[] = [];
      let datos: any[] = [];
      console.log(this.listadoEspecialidades);
      this.listadoEspecialidades.forEach((especialidad) => {
        nombresEspecialidades.push(especialidad.nombre);
        let turnos = this.listadoTurnos.filter(turno => turno.especialidad.nombre == especialidad.nombre);
        datos.push(turnos.length);
      });
      console.log(nombresEspecialidades);
      console.log(datos);
      const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: nombresEspecialidades,
          datasets: [
            {
              label: 'Turnos',
              data: datos,
              backgroundColor: [
                '#ffc409',
                '#eb445a',
                '#3dc2ff',
                '#55ff9c',
                '#2fdf75',
                '#0044ff',
                '#ee55ff',
              ],
              borderColor: ['#000'],
              borderWidth: 2,
            },
          ],
        },
        options: {
          maintainAspectRatio: false

        },
      });
    }
      , 1000);
  }

  generarChartTurnosSolicitadoMedico() {
    this.spinner = true;
    setTimeout(() => {
      const ctx = (<any>document.getElementById('graficoTurnoSolicitadoMedico')).getContext(
        '2d'
      );

      let apellidosEspecialistas: any[] = [];
      let datos: any[] = [];
      console.log(this.listadoEspecialidades);

      this.listadoEspecialistas.forEach((especialista) => {
       // nombresEspecialidades.push(turno.especialista.apellido);
        let numeroTurnos = this.listadoTurnos.filter(turno => especialista.apellido == turno.especialista.apellido && turno.estado=='Pendiente' || turno.estado=='Aceptado');
        apellidosEspecialistas.push(especialista.apellido);
        datos.push(numeroTurnos.length);
      });
      console.log(apellidosEspecialistas);
      console.log(datos);
      const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: apellidosEspecialistas,
          datasets: [
            {
              label: 'Turnos solicitados',
              data: datos,
              backgroundColor: [
                '#ffc409',
                '#eb445a',
                '#3dc2ff',
                '#55ff9c',
                '#2fdf75',
                '#0044ff',
                '#ee55ff',
              ],
              borderColor: ['#000'],
              borderWidth: 2,
            },
          ],
        },
        options: {
          maintainAspectRatio: false

        },
      });
    }
      , 1000);
  }
  generarChartTurnosFinalizadoMedico() {
    this.spinner = true;
    setTimeout(() => {
      const ctx = (<any>document.getElementById('graficoTurnoFinalizadoMedico')).getContext(
        '2d'
      );

      let apellidosEspecialistas: any[] = [];
      let datos: any[] = [];
      console.log(this.listadoEspecialidades);

      this.listadoEspecialistas.forEach((especialista) => {
       // nombresEspecialidades.push(turno.especialista.apellido);
        let numeroTurnos = this.listadoTurnos.filter(turno => especialista.apellido == turno.especialista.apellido && turno.estado=='Realizado');
        apellidosEspecialistas.push(especialista.apellido);
        datos.push(numeroTurnos.length);
      });
      console.log(apellidosEspecialistas);
      console.log(datos);
      const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: apellidosEspecialistas,
          datasets: [
            {
              label: 'Turnos finalizados',
              data: datos,
              backgroundColor: [
                '#ffc409',
                '#eb445a',
                '#3dc2ff',
                '#55ff9c',
                '#2fdf75',
                '#0044ff',
                '#ee55ff',
              ],
              borderColor: ['#000'],
              borderWidth: 2,
            },
          ],
        },
        options: {
          maintainAspectRatio: false

        },
      });
    }
      , 1000);
  }

  generarChartTurnosPorDias() {
    this.spinner = true;
    setTimeout(() => {
      const ctx = (<any>document.getElementById('graficoPorDias')).getContext(
        '2d'
      );

      let turnosPorDia = [0, 0, 0, 0, 0, 0];
      let diasNombres: any[] = [];
      this.listadoTurnos.forEach((turno) => {
        let dia = turno.fecha.dia.split(' ');
        let nombre = dia[0];

        switch (nombre) {
          case "Lunes":
            turnosPorDia[0] += 1
            break;
          case "Martes":
            turnosPorDia[1] += 1
            break;
          case "Miércoles":
            turnosPorDia[2] += 1
            break;
          case "Jueves":
            turnosPorDia[3] += 1
            break;
          case "Viernes":
            turnosPorDia[4] += 1
            break;
          case "Sábado":
            turnosPorDia[5] += 1
            break;
        }

        if (diasNombres.length == 0) {
          diasNombres.push(nombre);
        }
        else if(!diasNombres.includes(nombre)){
          diasNombres.push(nombre);

        }

      });
      const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábados'],
          datasets: [
            {
              label: 'Turnos por día',
              data: turnosPorDia,
              backgroundColor: [
                '#ffc409',
                '#eb445a',
                '#3dc2ff',
                '#55ff9c',
                '#2fdf75',
                '#0044ff',
                '#ee55ff',
              ],
              borderColor: ['#000'],
              borderWidth: 2,
            },
          ],
        },
        options: {
          maintainAspectRatio: false

        },
      });
    }
      , 1000);
  }

  
  imprimirPdf(id:string): void {
    const DATA = document.getElementById(id);
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    if(DATA!=null)
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 5;
        const bufferY = 5;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(`${new Date().toISOString()}_grafico.pdf`);
      });
  }

  generarExcel() { 
    const Excel = require ('exceljs');
    let workbook  = new Excel.Workbook();
    let worksheet = workbook.addWorksheet("Listado de logs");
    let encabezado = ["Usuario","Dia","Hora"];
    let filaEncabezado = worksheet.addRow(encabezado);
    let nombreArchivo = "Logs";

    for(let log of this.logs)
    {
      let fila = [ log.usuario,log.dia,log.hora];
      worksheet.addRow(fila);
    }

    workbook.xlsx.writeBuffer().then((data : any) =>{
      let blob = new Blob([data],{ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fileSaver.saveAs(blob,nombreArchivo + '.xlsx');
    })
  }
}
