import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Horario } from 'src/app/class/horario';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FechaPipe } from 'src/app/pipes/fecha.pipe';
import { FormatoDniPipe } from 'src/app/pipes/formato-dni.pipe';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuarioActual: any;
  mostrarEspecialidades: boolean = false;
  especialidadSeleccionada: any = "";
  dias: any[] = [];
  datoABuscar : any = "";
  horario: Horario;
  horarioEspecialidad: any;
  horarioSeleccionado : string[] = [];
  hc : any = "";
  mostrarPDF : boolean = false;
  lunesSeleccionado : boolean = false;
  martesSeleccionado : boolean = false;
  miercolesSeleccionado : boolean = false;
  juevesSeleccionado : boolean = false;
  viernesSeleccionado : boolean = false;
  sabadoSeleccionado : boolean = false;
  todoElDiaSeleccionado : boolean = false;
  mananaSeleccionado : boolean = false;
  tardeSeleccionado : boolean = false;
  sabadoHorarioSeleccionado : boolean = false;
  diaEncontrado: boolean = false;
  mostrarHC: boolean = false;
  fecha: any;


  spinner: boolean = true;

  /*horarios*/
  horarioCompleto : string[] = ["08:00","19:00"];
  horarioMañana : string[] = ["08:00","12:00"];
  horarioTarde : string[] = ["13:00","19:00"];
  horarioSabado: string[] = ["08:00", "14:00"];
  
  horariosBd: any[] = [];

  especialistaConHorario : boolean = false;
  horarioAModificar: any = "";
  diaDeEmision : any = [];
  diaDeEmisionParseado: any = "";
  historiasClinicasAFiltrar : any = [];
  historiasClinicas : any = [];

  constructor(public auth: AuthService, private router: Router, private firestoreService:FirestoreService, private notification:NotificationsService,private fp : FechaPipe, public dniPipe:FormatoDniPipe) { 
    this.usuarioActual = this.auth.usuarioActual;
    this.fecha = new Date();
    var dd = String(this.fecha.getDate()).padStart(2, '0');
    var mm = String(this.fecha.getMonth() + 1).padStart(2, '0');
    var yyyy = this.fecha.getFullYear();

    this.fecha = mm + '/' + dd + '/' + yyyy;
    this.horario = new Horario();
    this.firestoreService.traerHorarios().subscribe(value => {
      this.horariosBd = value;
    });
    if(this.usuarioActual.perfil == "paciente")
    {
      this.historiasClinicas = this.usuarioActual.historiasClinicas;
      this.historiasClinicasAFiltrar = this.usuarioActual.historiasClinicas;
    }
  }

  ngOnInit(): void {
  }
  cerrarSesion() { 
    this.auth.logout();
    this.router.navigateByUrl('');
  }

  cargarHorario()
  {
    this.horario.especialista = this.usuarioActual;

    this.horarioEspecialidad = {
      dias: this.dias,
      nombre: this.especialidadSeleccionada.nombre,
      rangoHorario: this.horarioSeleccionado  
    }
    this.horario.horariosEspecialidad.push(this.horarioEspecialidad);

    this.resetear();
  }

  resetear()
  {
    this.dias = [];
    this.especialidadSeleccionada = "";
    this.lunesSeleccionado = false;
    this.martesSeleccionado = false;
    this.miercolesSeleccionado = false;
    this.juevesSeleccionado = false;
    this.viernesSeleccionado = false;
    this.sabadoSeleccionado = false;
    this.todoElDiaSeleccionado = false;
    this.mananaSeleccionado = false;
    this.tardeSeleccionado = false;
    this.sabadoHorarioSeleccionado = false;
    this.diaEncontrado = false;
    this.horarioSeleccionado = [];
    
  }

  ver()
  {
    this.mostrarPDF = !this.mostrarPDF;
  }
  seleccionarDia(diaAAgregar : number)
  {
    switch(diaAAgregar)
    {
      case 1:
        this.lunesSeleccionado = !this.lunesSeleccionado;
        break;
      case 2:
        this.martesSeleccionado = !this.martesSeleccionado;
        break;
      case 3:
        this.miercolesSeleccionado = !this.miercolesSeleccionado;
        break;
      case 4:
        this.juevesSeleccionado = !this.juevesSeleccionado;
        break;
      case 5:
        this.viernesSeleccionado = !this.viernesSeleccionado;
        break;
      case 6:
        this.sabadoSeleccionado = !this.sabadoSeleccionado;
        break;
    }

    for (let dia of this.dias) 
    {
      if(dia == diaAAgregar || this.dias.length == 0)
      {
        this.diaEncontrado = true;
      }
    }

    if(!this.diaEncontrado)
    {
      this.dias.push(diaAAgregar);
    }
    else
    {
      let indice : number;
      indice = this.dias.indexOf(diaAAgregar,0);
      this.dias.splice(indice,1);
    }
    
  }

  seleccionarHorario(horario : string)
  {
    switch(horario)
    {
      case "todoElDia":
        this.horarioSeleccionado = this.horarioCompleto;
        this.todoElDiaSeleccionado = true;
        this.mananaSeleccionado = false;
        this.tardeSeleccionado = false;
        this.sabadoSeleccionado = false;
        break;
      case "mañana":
        this.horarioSeleccionado = this.horarioMañana;
        this.todoElDiaSeleccionado = false;
        this.mananaSeleccionado = true;
        this.tardeSeleccionado = false;
        this.sabadoSeleccionado = false;
        break;
      case "tarde":
        this.horarioSeleccionado = this.horarioTarde;
        this.todoElDiaSeleccionado = false;
        this.mananaSeleccionado = false;
        this.tardeSeleccionado = true;
        this.sabadoSeleccionado = false;
        break;
      case "sabado":
        this.horarioSeleccionado = this.horarioSabado;
        this.todoElDiaSeleccionado = false;
        this.mananaSeleccionado = false;
        this.tardeSeleccionado = false;
        this.sabadoHorarioSeleccionado = true;
        break;
    }
  }
  
  yaTieneHorario()
  {
      for (let horario of this.horariosBd) {
        if (horario.especialista.dni == this.usuarioActual.dni) {
          this.especialistaConHorario = true;
          this.horarioAModificar = horario;
          break;
        }
      }
    
  }

  subirHorario()
  {
    let id : number;
      this.yaTieneHorario();
      if(this.especialistaConHorario)
      {
        id = this.horarioAModificar.id;
        this.spinner = true;
        this.firestoreService.modificarHorario(this.horario,id).then(async () =>{
          setTimeout(() => {
            this.spinner = false;
            this.notification.showNotificationSuccess("Horio registrado","Se modificó el horario con exito.");
            this.resetear(); 
            this.horario = new Horario();
          }, 1000);
        })
        .catch((error : any)=>{
          this.notification.showNotificationError("ERROR","Ocurrió un problema al modificar el horario");
        });
      }
      else
      {
        this.spinner = true;
        this.firestoreService.agregarHorario(this.horario).then(async () =>{
          setTimeout(() => {
            this.spinner = false;
            this.notification.showNotificationSuccess("Horario agregado!","Se guardo el horario.");
            this.resetear(); 
            this.horario = new Horario();
          }, 1000);
        })
        .catch((error : any)=>{
          this.notification.showNotificationError("ERROR","No se pudo guardar el horario.");
        });
      }
  }
  imprimirPdf(): void {
    const DATA : any = document.getElementById("historiaClinica");
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 1,
    };
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
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
        docResult.save(this.auth.usuarioActual.nombre + this.auth.usuarioActual.apellido + ".pdf");
      });
  }
  cargarDiaEmision()
  {
    this.diaDeEmision = [];  
    this.diaDeEmisionParseado = "";

    let dia : Date = new Date();

    this.diaDeEmision.push(dia.toUTCString().split(' ')[0] + 
                        dia.toUTCString().split(' ')[1] + ' ' + 
                        dia.toUTCString().split(' ')[2] + ' ' +
                        dia.toUTCString().split(' ')[3]);   
      
      
    this.diaDeEmisionParseado = this.fp.transform(this.diaDeEmision)[0];
  }

  buscar()
  {
    this.historiasClinicasAFiltrar = [];
    if(this.datoABuscar == "")
    {
      this.historiasClinicasAFiltrar = this.historiasClinicas;
    }
    else
    {
      this.historiasClinicasAFiltrar = this.historiasClinicas.filter((hc : any) => hc.especialidad.nombre.includes(this.datoABuscar));
    }
  }

}

