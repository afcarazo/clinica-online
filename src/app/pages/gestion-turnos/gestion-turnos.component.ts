import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-gestion-turnos',
  templateUrl: './gestion-turnos.component.html',
  styleUrls: ['./gestion-turnos.component.css']
})
export class GestionTurnosComponent implements OnInit {
  turnos : any = "";
  todosLosTurnos : any = "";
  especialidadBuscar : string = "";
  especialistaBuscar : string = "";
  cancelado : boolean = false;
  form : FormGroup;
  claseCardCancelado = 'card text-dark bg-danger';
  claseCardEspera = 'card text-dark bg-warning';
  datoABuscar : any = "";
  turnosFiltradosBusqueda : any = "";
  constructor(private turnoService : FirestoreService,private fb : FormBuilder, private ts : NotificationsService) 
  {
    this.form = this.fb.group({
      'comentario' : ['',[Validators.required,Validators.maxLength(40),Validators.minLength(10)]]
    });
    this.turnoService.traerTurnos().subscribe(value =>{
      this.turnos = value;
      this.todosLosTurnos = value;
      this.turnosFiltradosBusqueda = value;

    });
  }

  ngOnInit(): void {
  }

  buscar()
  {
    this.todosLosTurnos = [];
    if(this.datoABuscar == "")
    {
      this.todosLosTurnos = this.turnos;
    }
    else
    {
      for(let turno of this.turnosFiltradosBusqueda) 
      {
        if(turno.especialista.nombre.includes(this.datoABuscar) || turno.especialista.apellido.includes(this.datoABuscar))
        {
          this.todosLosTurnos.push(turno);
        }
        else
        {
          if(turno.especialidad.nombre.includes(this.datoABuscar))
          {
            this.todosLosTurnos.push(turno);
          }
          else
          {
            if(turno.paciente.nombre.includes(this.datoABuscar) || turno.paciente.apellido.includes(this.datoABuscar))
            {
              this.todosLosTurnos.push(turno);
            }
            else
            {
              if(turno.fecha.dia.includes(this.datoABuscar) || turno.fecha.hora.includes(this.datoABuscar))
              {
                this.todosLosTurnos.push(turno);
              }
              else
              {
                if(turno.estado.includes(this.datoABuscar))
                {
                  this.todosLosTurnos.push(turno);
                }
                else
                {
                  if(turno.historiaClinica != undefined)
                  {
                    if(turno.historiaClinica?.altura.includes(this.datoABuscar) || turno.historiaClinica?.peso.includes(this.datoABuscar) || turno.historiaClinica?.temperatura.includes(this.datoABuscar) || turno.historiaClinica?.presion.includes(this.datoABuscar))
                    {
                      this.todosLosTurnos.push(turno);
                    }
                    else
                    {
                      if(turno.historiaClinica.datoDinamico1 != "" && (turno.historiaClinica?.datoDinamico1?.clave.includes(this.datoABuscar) || turno.historiaClinica?.datoDinamico1?.valor.includes(this.datoABuscar)))
                      {
                        this.todosLosTurnos.push(turno);
                      }
                      else
                      {
                        if(turno.historiaClinica.datoDinamico2 != "" && (turno.historiaClinica?.datoDinamico2?.clave.includes(this.datoABuscar) || turno.historiaClinica?.datoDinamico2?.valor.includes(this.datoABuscar)))
                        {
                          this.todosLosTurnos.push(turno);
                        }
                        else
                        {
                          if(turno.historiaClinica.datoDinamico3 != "" && (turno.historiaClinica?.datoDinamico3?.clave.includes(this.datoABuscar) || turno.historiaClinica?.datoDinamico3?.valor.includes(this.datoABuscar)))
                          {
                            this.todosLosTurnos.push(turno);
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

  modificarTurnoBD(turno : any, id : any)
  {
    return this.turnoService.modificarTurno(turno,id);
  }

  cancelarTurno(turno : any)
  {
    turno.estado = "Cancelado";
    turno.comentarioAdministrador = this.form.get("comentario")?.value;
    this.modificarTurnoBD({...turno}, turno.id).then((response : any) => {
      setTimeout(() => {
        this.ts.showNotificationSuccess("Se cancelo el turno","Turno cancelado");
      }, 1000);
    })
    .catch((response : any) => {
      setTimeout(() => {
        this.ts.showNotificationError("No se pudo cancelar el turno","Error al cancelar el turno");
      }, 1000);
    });
  }
}

