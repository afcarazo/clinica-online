import { Component, OnInit } from '@angular/core';
import { Especialidad } from 'src/app/class/especialidad';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { DiaPipe } from 'src/app/pipes/dia.pipe';
import { FechaPipe } from 'src/app/pipes/fecha.pipe';
import { Paciente } from 'src/app/class/paciente';

@Component({
  selector: 'app-sacar-turno',
  templateUrl: './sacar-turno.component.html',
  styleUrls: ['./sacar-turno.component.css']
})
export class SacarTurnoComponent implements OnInit {

  usuarioActual: any;
  listadoEspecialistas: any[] = [];
  listadoEspecialistasFiltradoEspecialidad: any[] = []; 
  listadoEspecialidades: any[] = [];
  eligioEspecialista: boolean = false;
  eligioEspecialidad: boolean = false;
  spinner: boolean = false;
 
  pacientes : any = "";
  especialidades : any = "";
  horarios : any = "";
  especialidadSeleccionada: any = "";
  diasArrayFiltrados: any[] = [];
  horarioEspecialidad : any = "";
  diaSeleccionado: any = "";
  pacienteActual: any = "";
  todosLosTurnos : any;
  fecha: any = "";
  turno: any = "";
  especialistaSeleccionado: any = "";
  turnos : any = "";
  verHoras: boolean = false;
  verTurnos: boolean = false;
  pacienteCargado: boolean = false;
  horasArray: any = [];
  especialidadesEspecialista: any = [];
  sinDias: boolean = false;
  horarioEspecialista: any = ""; 
  tieneHorarios: boolean = false;
  diasArrayParseado: any = [];
  diasArray: any = [];
  arrayTurnoSegunDia: any = [];
  verPaciente: boolean = false;
  constructor(private firestoreService: FirestoreService, private notification: NotificationsService,
    public auth: AuthService,private dp : DiaPipe,private fp : FechaPipe) { 
    this.fecha = new Date();
    this.usuarioActual = this.auth.usuarioActual;
  }

  ngOnInit(): void {
    this.firestoreService.traerListadoAEspecialistas().subscribe(usuarios => {
      if (usuarios != null) {
        this.listadoEspecialistas = usuarios;
      }
    })
    this.firestoreService.traerListadoEspecilidades().subscribe(especialidades => {
      if (especialidades != null) {
        this.listadoEspecialidades = especialidades;
      }
    })
    
    this.firestoreService.traerTurnos().subscribe(value =>{
      this.todosLosTurnos = value;
    });
    this.firestoreService.traerHorarios().subscribe(value => {
      this.horarios = value;
    });
    this.firestoreService.traerPacientes().subscribe(value => {
      this.pacientes = value;
    });

  }
  
 cargarPaciente(paciente : Paciente)
  {
    this.pacienteActual = paciente;
   this.pacienteCargado = true;
   this.verPaciente = false;
  }

  async elegirEspecialidad(especialidad: Especialidad) {
    if (this.auth.usuarioActual.perfil=='administrador') {
      this.verPaciente = true;
     }
    this.eligioEspecialidad = true;
    this.especialidadSeleccionada = especialidad;
    console.log('especialidad ->', especialidad);
    for (let index = 0; index < this.listadoEspecialistas.length; index++) {
      console.log(this.listadoEspecialistas[index].especialidades);
      for (let j = 0; j < this.listadoEspecialistas[index].especialidades.length; j++) {
        if ( this.listadoEspecialistas[index].especialidades[j].nombre == especialidad.nombre) {
          this.listadoEspecialistasFiltradoEspecialidad.push(this.listadoEspecialistas[index]);
          console.log( this.listadoEspecialistasFiltradoEspecialidad);
        }
        
      }
     

    }
  
  }

  seleccionarTurno(hora : any)
  {
    this.fecha = {
      dia : this.diaSeleccionado,
      hora : hora
    }

    this.turno = {
      paciente : this.pacienteActual,
      especialista : this.especialistaSeleccionado,
      especialidad : this.especialidadSeleccionada,
      estado: "Pendiente",
      fecha : this.fecha
    }
   
    this.firestoreService.agregarTurno(this.turno);
    
    this.spinner = true
    setTimeout(() => {
      this.notification.showNotificationSuccess("Turno exitoso!","Turno solicitado con exito");
      this.spinner = false;
      this.eligioEspecialidad = false;
    }, 2000);


    this.turnos = [];
    this.verTurnos = false;
    this.verHoras = false;
    this.pacienteCargado = false;
    this.pacienteActual = "";
    this.diasArrayFiltrados = [];
    this.horasArray = [];
    this.especialidadesEspecialista = [];
    this.diaSeleccionado = "";
    this.especialidadSeleccionada = "";
    this.especialistaSeleccionado = "";
    this.sinDias = false;
  }

  mostrarHorarios(dia : any)
  {
    let arrayDia = dia.split(" ");
    
    if(arrayDia.length == 3)
    {
      this.diaSeleccionado = arrayDia[0] + " " + arrayDia[1];
      this.seleccionarTurno(arrayDia[2]);  
    }
    else
    {
      this.diaSeleccionado = dia;
      this.horasArray = this.cargarHoras(this.horarioEspecialidad.rangoHorario[0],this.horarioEspecialidad.rangoHorario[1]);
      this.verHoras = true;
    }
  }

  cargarHoras(entrada : string, salida : string, dia : string = "")
  {
    let entradaArray;
    let salidaArray;
    let horarios = [];
    let hora;
    let fecha;
    
    entradaArray = entrada.split(':');
    salidaArray = salida.split(':');

    hora = parseInt(entradaArray[0]);
    
    do
    {
      if(dia != "")
      {
        fecha = {
          dia : dia,
          hora : hora + ':' + entradaArray[1]
        }
      }
      else
      {
        fecha = {
          dia : this.diaSeleccionado,
          hora : hora + ':' + entradaArray[1]
        }
      }

      if(this.estaElTurnoDisponible(fecha))
      {
        horarios.push(hora + ':' + entradaArray[1]);  
      }

      if(entradaArray[1] == "00")
      {
        entradaArray[1] = "30";
      }
      else
      {
        if(entradaArray[1] == "30")
        {
          entradaArray[1] = "00";
          hora += 1;
        } 
      } 
    }
    while((hora <= parseInt(salidaArray[0]) - 1) || entradaArray[1] == "30");

    return horarios;
  }
  estaElTurnoDisponible(fecha : any) {
    return !Boolean(this.todosLosTurnos.filter((turno : any) => turno.especialidad.nombre == this.especialidadSeleccionada.nombre && turno.especialista.dni == this.especialistaSeleccionado.dni && turno.fecha.dia === fecha.dia && turno.fecha.hora === fecha.hora && ["Aceptado", "Pendiente"].indexOf(turno.estado) != -1).length);
  }
  filtrarHorarios()
  {
    console.log("ACA",this.horarios);
    for (let horario of this.horarios) 
    {
      for (let he of horario.horariosEspecialidad) 
      {
        console.log('comparacion ->', horario.especialista.dni  );
        console.log('comparacion ->', this.especialistaSeleccionado.dni  );
        console.log('ESPECIALISTA ->',he.nombre );
        console.log('ESPECIALISTA ->',this.especialidadSeleccionada.nombre );
        if(horario.especialista.dni == this.especialistaSeleccionado.dni && he.nombre == this.especialidadSeleccionada.nombre)
        {
          this.horarioEspecialista = horario;  
          this.horarioEspecialidad = he;
          console.log('HORARIOS ESPECIALISTA', this.horarioEspecialidad);
          this.tieneHorarios = true;
        }
      }
    }
  }
  cargarDias()
  {
    this.diasArray = [];  

    let dia : Date = new Date();
    let dia2 : Date = new Date();

    for (let i = 0; i < 15; i++) 
    {
      if(dia2.toUTCString().split(' ')[0] !== "Sun,")
      {
        console.log(this.diasArray[i]);
        this.diasArray.push(dia2.toUTCString().split(' ')[0] + 
                            dia2.toUTCString().split(' ')[1] + ' ' + 
                            dia2.toUTCString().split(' ')[2] + ' ' +
                            dia2.toUTCString().split(' ')[3]);   
      }
      
      dia2.setDate(dia.getDate() + 1);
      dia.setDate(dia.getDate() + 1);
    }
  }

  filtrarDias()
  {

    this.diasArrayParseado = this.fp.transform(this.diasArray);
    
    for(let dia of this.diasArrayParseado) 
    {
      for(let diaEspecialidad of this.horarioEspecialidad.dias) 
      {
        let diaSplit = dia.split(' ');
        diaEspecialidad = this.dp.transform(diaEspecialidad);
        
        if(diaEspecialidad == diaSplit[0])
        {
          this.arrayTurnoSegunDia = this.todosLosTurnos.filter((turno : any) => turno.especialidad.nombre == this.especialidadSeleccionada.nombre && turno.especialista.dni == this.especialistaSeleccionado.dni && turno.fecha.dia === dia && turno.estado == "Pendiente");
          let horarios = this.cargarHoras(this.horarioEspecialidad.rangoHorario[0],this.horarioEspecialidad.rangoHorario[1]);
          
          if((horarios.length - this.arrayTurnoSegunDia.length) > 0)
          {
            let horas = this.cargarHoras(this.horarioEspecialidad.rangoHorario[0],this.horarioEspecialidad.rangoHorario[1],dia);
            if(horas.length == 1)
            {
              dia = dia + " " + horas[0];
            }

            this.diasArrayFiltrados.push(dia);
            console.log( this.diasArrayFiltrados);
          }
        }
      }
    }
    console.log('array dias:',this.diasArrayFiltrados);
    
  }
  
  mostrarTurnos()
  {
    this.cargarDias();
    this.filtrarDias();

    if(this.diasArrayFiltrados.length == 1)
    {
      this.mostrarHorarios(this.diasArrayFiltrados[0])
    }
    else
    {
      if(this.diasArrayFiltrados.length == 0)
      {
        this.sinDias = true;
      }
      else
      {
        this.verTurnos = true;
      }
    }
  }

  listarEspecialidades()
  {
    for(let especialidad of this.especialistaSeleccionado.especialidades)
    {
      this.especialidadesEspecialista.push(especialidad);
      console.log("sfd>",especialidad);
    }
  }
  seleccionarEspecialista(especialista : any)
  {
    this.especialistaSeleccionado = especialista;
    if(this.especialidadSeleccionada != "")
    {
      this.especialidadSeleccionada = this.especialidadSeleccionada;
      this.diasArrayFiltrados = [];
      this.horasArray = [];
    }
    this.especialidadSeleccionada = this.especialidadSeleccionada;
    this.filtrarHorarios();
    if(this.tieneHorarios)
    {
      this.mostrarTurnos();
      this.verTurnos = true;
    }
    else
    {
     this.notification.showNotificationError("Ese especialista no posee horarios","Especialista sin horarios");
      this.eligioEspecialidad = false;
    }



    this.eligioEspecialista = true;
    if(this.usuarioActual.perfil == "paciente")
    {
      this.pacienteActual = this.usuarioActual;
    }
    

    this.listarEspecialidades();
    console.log('ENTRE ACÁ->', this.especialidadesEspecialista);

    if(this.especialidadesEspecialista.length == 1)
    {
      this.especialidadSeleccionada = this.especialidadesEspecialista[0];
      this.filtrarHorarios();
  
      if(this.tieneHorarios)
      {
        this.mostrarTurnos();
        this.verTurnos = true;
      }
      else
      {
        this.notification.showNotificationError("Ese especialista no posee horarios","Especialista sin horarios");
      }
    }
    else
    {

    }
  }

}
