import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import * as fs from 'file-saver';

@Component({
  selector: 'app-seccion-usuarios',
  templateUrl: './seccion-usuarios.component.html',
  styleUrls: ['./seccion-usuarios.component.css']
})
export class SeccionUsuariosComponent implements OnInit {

  listadoUsuarios: any[] = [];
  listadoPacientes: any[] = [];
  turnos: any[] = [];
  historialesFiltrados: any[] = [];
  mostrarHistoriales: boolean = false;

  constructor(private firestoreService: FirestoreService, private router: Router, public auth: AuthService) { }

  ngOnInit(): void {
    this.firestoreService.traerListadoUsuarios().subscribe(usuarios => {
      if (usuarios != null) {
        this.listadoUsuarios = usuarios;
      }
    })
    this.firestoreService.traerTurnos().subscribe(turnos => {
      if (turnos != null) {
        this.turnos = turnos;
      }
    })

    this.firestoreService.traerPacientes().subscribe(usuarios => {
      if (usuarios != null) {
        this.listadoPacientes = usuarios;
      }
    })

  }
  navegarARegistroPaciente() {
    this.router.navigateByUrl('registrar-paciente');

  }

  navegarARegistroEspecialista() {
    this.router.navigateByUrl('registrar-especialista');
  }
  navegarARegistroAdministrador() {
    this.router.navigateByUrl('registrar-administrador');
  }

  habilitarEspecialista(uid: string) {
    console.log(uid);
    this.auth.habilitarEspecialista(uid);
  }
  deshabilitarEspecialista(uid: string) {
    console.log(uid);
    this.auth.deshabilitarEspecialista(uid);
  }
  generarExcel() {
    const Excel = require('exceljs');
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet("Listado de Usuarios");
    let encabezado = ["Nombre", "Apellido", "DNI", "Edad", "Mail", "Perfil"];
    let filaEncabezado = worksheet.addRow(encabezado);
    let nombreArchivo = "Lista de usuarios";

    for (let usuario of this.listadoUsuarios) {
      let fila = [usuario.nombre, usuario.apellido, usuario.dni, usuario.edad, usuario.mail, usuario.perfil];
      worksheet.addRow(fila);
    }

    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, nombreArchivo + '.xlsx');
    })

  }

  generarExcelDePaciente(paciente: any) {
    const Excel = require('exceljs');
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet("Listado de Consultas");
    let encabezado = ["Especialista", "Especialidad", "Fecha"];
    let filaEncabezado = worksheet.addRow(encabezado);
    let nombreArchivo = "Consultas de " + paciente.nombre + " " + paciente.apellido;

    for (let hc of paciente.historiasClinicas) {
      let fila = [hc.especialista.nombre + " " + hc.especialista.apellido, hc.especialidad.nombre, hc.fecha.dia + " " + hc.fecha.hora];
      worksheet.addRow(fila);
    }

    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, nombreArchivo + '.xlsx');
    })

  }

  mostrarHistoriaClinica(paciente: any) {
    /*this.pacienteSeleccionado = "";
    this.pacienteSeleccionado = paciente;
    this.mostrarHC = !this.mostrarHC;*/
    if (paciente.perfil == 'paciente') {

      for (let index = 0; index < this.turnos.length; index++) {
        console.log(this.turnos[index]);
        if (this.turnos[index].estado == "Realizado" && this.turnos[index].paciente.uid == paciente.uid) {
          if (this.turnos[index].historiaClinica != undefined)
            this.historialesFiltrados.push(this.turnos[index].historiaClinica)
        }
      }
      if (this.historialesFiltrados.length > 0) {
        this.mostrarHistoriales = true
      }

    }

  }

  
  cerrarHistoriales()
  {
    this.mostrarHistoriales = false
    this.historialesFiltrados =[]
  }
}
