import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-ver-turnos',
  templateUrl: './ver-turnos.component.html',
  styleUrls: ['./ver-turnos.component.css']
})
export class VerTurnosComponent implements OnInit {
  listadoTurnos: any = [];
  turnosFiltrados : any = "";
  turnos: any = "";
  spinner: boolean = false;
  turnosFiltradosBusqueda: any = [];
  pacientes: any = [];
  turnosFiltradosEspecialista: any = "";
  verResena: boolean = false;
  cancelado: boolean = false;
  calificar: boolean = false;
  encuesta: boolean = false;
  formComentario: FormGroup;
  formFinalizado: FormGroup;
  formEncuesta: FormGroup;
  formDatosDinamicos : FormGroup;
  rechazado: boolean = false;
  pacienteAModificar : any = "";
  respetoHorario: string = "";
  experienciaClinica: string = "";
  atencion: string = "";
  finalizado: boolean = false;
  dato1 : any = "";
  dato2 : any = "";
  dato3: any = "";
  datoABuscar : any = "";


  constructor(public auth: AuthService, private firestore: FirestoreService,
    private fbComentario: FormBuilder, private fbEncuesta: FormBuilder, private fbFinalizado: FormBuilder
    , private fbDinamico: FormBuilder, private notification: NotificationsService) { 
    this.formComentario = this.fbComentario.group({
      'comentario' : ['',[Validators.required,Validators.maxLength(40),Validators.minLength(10)]]
    });
    this.formEncuesta = this.fbEncuesta.group({
      'agregado' : ['',[Validators.required,Validators.maxLength(50),Validators.minLength(10)]]
    });
    this.formDatosDinamicos = this.fbDinamico.group({
      'dato' : [''],
      'valor' : [''],
    });
    this.formFinalizado = this.fbFinalizado.group({
      'comentario' : ['',[Validators.required,Validators.maxLength(40),Validators.minLength(10)]],
      'diagnostico' : ['',[Validators.required,Validators.maxLength(60),Validators.minLength(15)]],
      'altura' : ['',[Validators.required]],
      'peso' : ['',[Validators.required]],
      'temperatura' : ['',[Validators.required]],
      'presion' : ['',[Validators.required]],
    });


  }

  ngOnInit(): void {
    this.firestore.traerPacientes().subscribe(value =>
      {
        this.pacientes = value;
      });
    this.firestore.traerTurnos().subscribe(value => 
      {
          this.turnos = value;
          if(this.auth.usuarioActual.perfil == "paciente")
          {
            this.listadoTurnos = this.turnos.filter((turno : any) => turno.paciente.dni == this.auth.usuarioActual.dni);
            this.turnosFiltrados = this.listadoTurnos;
            this.turnosFiltradosBusqueda = this.listadoTurnos;
            
          }
          else
          {
            if(this.auth.usuarioActual.perfil == "especialista")
            {
              this.listadoTurnos = this.turnos.filter((turno : any) => turno.especialista.dni == this.auth.usuarioActual.dni);
              this.turnosFiltradosEspecialista = this.listadoTurnos;
              this.turnosFiltradosBusqueda = this.listadoTurnos;
            }
          }
      });
  
  }

  cancelarTurno(turno : any)
  {
    if(this.auth.usuarioActual.perfil == "paciente")
    {
      console.log('acá');
      turno.estado = "Cancelado";
      turno.comentarioDelPaciente = this.formComentario.get("comentario")?.value;
    }
    else
    {
      if(this.auth.usuarioActual.perfil == "especialista")
      {
        if(this.cancelado)
        {
          turno.estado = "Cancelado";
          turno.comentarioDelEspecialista = this.formComentario.get("comentario")?.value;
        }
        else
        {
          if(this.rechazado)
          {
            turno.estado = "Rechazado";
            turno.comentarioDelEspecialista = this.formComentario.get("comentario")?.value;
          }
        }
      }
    }
    this.modificarTurnoBD({...turno}, turno.id).then((response : any) => {
      this.notification.showNotificationSuccess("Se cancelo el turno","Cancelado");
      this.cancelado = false;
      this.rechazado = false;
      this.formComentario.get("comentario")?.setValue('');
    })
    .catch((response : any) => {
      setTimeout(() => {
        this.spinner = true;
        this.notification.showNotificationError("No se logro cancelar el turno","Error al cancelar turno");
      }, 1000);
      this.spinner = false;
    });
  }


  finalizarTurno(turnoMod : any)
  {
    for(let paciente of this.pacientes) 
    {
      if(paciente.dni == turnoMod.paciente.dni)
      {
        this.pacienteAModificar = paciente;
        break;
      }  
    }
    let historiaClinica = {
      fecha : turnoMod.fecha,
      especialidad : turnoMod.especialidad,
      especialista : this.auth.usuarioActual,
      altura : this.formFinalizado.get("altura")?.value.toString(),
      peso : this.formFinalizado.get("peso")?.value.toString(),
      temperatura : this.formFinalizado.get("temperatura")?.value.toString(),
      presion : this.formFinalizado.get("presion")?.value.toString(),
      datoDinamico1 : this.dato1,
      datoDinamico2 : this.dato2,
      datoDinamico3 : this.dato3,

    }

    this.cargarHistoriaClinica(this.pacienteAModificar,historiaClinica);
   
    
    for(let paciente of this.pacientes) 
    {
      if(paciente.dni == turnoMod.paciente.dni)
      {
        this.pacienteAModificar = paciente;
        break;
      }  
    }

    let turno = {
      paciente : this.pacienteAModificar,
      especialista : this.auth.usuarioActual,
      especialidad : turnoMod.especialidad,
      fecha : turnoMod.fecha,
      estado : "Realizado",
      comentarioDelEspecialista: this.formFinalizado.get("comentario")?.value,
      diagnostico: this.formFinalizado.get("diagnostico")?.value,
      historiaClinica : historiaClinica
    }

    this.modificarTurnoBD({...turno}, turnoMod.id).then((response : any) => {
      
      this.notification.showNotificationSuccess("Se finalizo el turno","Turno");
      this.finalizado = false;
      this.formDatosDinamicos.reset();
      this.formFinalizado.reset();
      this.formComentario.reset();
      this.dato1 = "";
      this.dato2 = "";
      this.dato3 = "";
      
    })
    .catch((response : any) => {
      setTimeout(() => {
        this.spinner = true;
        this.notification.showNotificationError("No se finalizado el turno","ERROR");
      }, 1000);
      this.spinner = false;
    });
  }

  modificarTurnoBD(turno : any, id : any)
  {
    return this.firestore.modificarTurno(turno,id);
  }
  cargarEncuesta(turno : any)
  {
    let encuestaAAgregar = {
      experienciaClinica : this.experienciaClinica,
      respetoHorarioConsulta : this.respetoHorario,
      agregado : this.formEncuesta.get("agregado")?.value
    }; 

    turno.encuesta = encuestaAAgregar;

    this.modificarTurnoBD({...turno}, turno.id).then((response : any) => {
     
      this.notification.showNotificationSuccess("Se cargo la encuesta","Encuesta cargada");
      this.encuesta = false;
      this.formEncuesta.get("agregado")?.setValue('');
      this.experienciaClinica = "";
      this.respetoHorario = "";
      
    })
    .catch((response : any) => {
      setTimeout(() => {
        this.spinner = true;
        this.notification.showNotificationError("No se ha cargado la encuesta","Error con la encuesta");
      }, 1000);
      this.spinner = false;
    });
  }

  modificarPacienteBD(paciente : any, id : any)
  {
    return this.firestore.modificarPaciente(paciente,id);
  }

  cargarHistoriaClinica(paciente : any,historiaClinica : any)
  {
    paciente.historiasClinicas.push(historiaClinica);

    this.modificarPacienteBD({...paciente},paciente.uid).then((response : any) =>{

      this.notification.showNotificationSuccess("Se cargo la historia clínica","Historia Clínica cargada");
    })
    .catch((error) => {
      setTimeout(() => {
        this.spinner = true;
        this.notification.showNotificationError("No se pudo cargar la historia clínica", "Error con la historia clínica");
        console.log(error);
      }, 1000);
      this.spinner = false;
    });
  }
  cargarCalificacion(turno : any)
  {
    turno.atencion = this.atencion;

    this.modificarTurnoBD({...turno}, turno.id).then((response : any) => {
      
      this.notification.showNotificationSuccess("Se cargo la calificación!","Calificación cargada.");
      this.calificar = false;
      this.atencion = "";
    })
    .catch((response : any) => {
      setTimeout(() => {
        this.spinner = true;
        this.notification.showNotificationError("No se pudo cargar la calificación","Error al agregar calificación");
      }, 1000);
      this.spinner  = false;
    });
  }

  aceptarTurno(turno : any)
  {
    this.rechazado = false;
    this.cancelado = false;
    turno.estado = "Aceptado";

    this.modificarTurnoBD({...turno}, turno.id).then((response : any) => {
      
      this.notification.showNotificationSuccess("Se acepto el turno","Turno aceptado");
    })
    .catch((response : any) => {
      setTimeout(() => {
        this.spinner = true;
        this.notification.showNotificationError("No se pudo aceptar el turno","Error al aceptar el turno");
      }, 1000);
      this.spinner = false;
    });
  }
  buscar()
  {
    this.listadoTurnos = [];
    if(this.datoABuscar == "")
    {
      this.listadoTurnos = this.turnos;
    }
    else
    {
      for(let turno of this.turnosFiltradosBusqueda) 
      {
        if(turno.especialista.nombre.includes(this.datoABuscar) || turno.especialista.apellido.includes(this.datoABuscar))
        {
          this.listadoTurnos.push(turno);
        }
        else
        {
          if(turno.especialidad.nombre.includes(this.datoABuscar))
          {
            this.listadoTurnos.push(turno);
          }
          else
          {
            if(turno.paciente.nombre.includes(this.datoABuscar) || turno.paciente.apellido.includes(this.datoABuscar))
            {
              this.listadoTurnos.push(turno);
            }
            else
            {
              if(turno.fecha.dia.includes(this.datoABuscar) || turno.fecha.hora.includes(this.datoABuscar))
              {
                this.listadoTurnos.push(turno);
              }
              else
              {
                if(turno.estado.includes(this.datoABuscar))
                {
                  this.listadoTurnos.push(turno);
                }
                else
                {
                  if(turno.historiaClinica != undefined)
                  {
                    if(turno.historiaClinica?.altura.includes(this.datoABuscar) || turno.historiaClinica?.peso.includes(this.datoABuscar) || turno.historiaClinica?.temperatura.includes(this.datoABuscar) || turno.historiaClinica?.presion.includes(this.datoABuscar))
                    {
                      this.listadoTurnos.push(turno);
                    }
                    else
                    {
                      if(turno.historiaClinica.datoDinamico1 != "" && (turno.historiaClinica?.datoDinamico1?.clave.includes(this.datoABuscar) || turno.historiaClinica?.datoDinamico1?.valor.includes(this.datoABuscar)))
                      {
                        this.listadoTurnos.push(turno);
                      }
                      else
                      {
                        if(turno.historiaClinica.datoDinamico2 != "" && (turno.historiaClinica?.datoDinamico2?.clave.includes(this.datoABuscar) || turno.historiaClinica?.datoDinamico2?.valor.includes(this.datoABuscar)))
                        {
                          this.listadoTurnos.push(turno);
                        }
                        else
                        {
                          if(turno.historiaClinica.datoDinamico3 != "" && (turno.historiaClinica?.datoDinamico3?.clave.includes(this.datoABuscar) || turno.historiaClinica?.datoDinamico3?.valor.includes(this.datoABuscar)))
                          {
                            this.listadoTurnos.push(turno);
                          }
                        }
                      }
                    }

                  }
                }
              }
            }
          }

        }
      }
     }    
  }

  datosExtrasAgregar() { 
    let clave = this.formDatosDinamicos.get("dato")?.value;
    let valor = this.formDatosDinamicos.get("valor")?.value;

    
    if(this.dato1 == "")
    {
      this.dato1 = {
        clave : clave,
        valor : valor,
      }
    }
    else
    {
      if(this.dato2 == "")
      {
        this.dato2 = {
          clave : clave,
          valor : valor,
        }
      }
      else
      {
        if(this.dato3 == "")
        {
          this.dato3 = {
            clave : clave,
            valor : valor,
          }
        }
      }
    }   
  }
}
