import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-seccion-pacientes',
  templateUrl: './seccion-pacientes.component.html',
  styleUrls: ['./seccion-pacientes.component.css']
})
export class SeccionPacientesComponent implements OnInit {

 
  pacientes : any = "";
  turnos : any = "";
  pacientesTurnos : any = [];
  pacientesFiltrados : any = [];
  mostrarPacientes : boolean = false;
  mostrarHC : boolean = false;
  mostrarHistoriales : boolean = false;
  pacienteSeleccionado : any = "";
  arrayDias : any = [];
  ultimaAtencion : any = "";
  atenciones : any = [];
  mostrarAtenciones : boolean = false;

  historialesFiltrados:any[]=[]
  constructor(public as : AuthService, private fs : FirestoreService) 
  {
  

  }

  ngOnInit(): void {
    this.fs.traerPacientes().subscribe(value => {
      this.pacientes = value;
      console.log('confirmar');
    });
    this.fs.traerTurnos().subscribe(value =>{
      this.turnos = value;
      this.cargarDatos();
    });
  }

  yaEstaEnArray(paciente : any)
  {
    let finded : boolean = false;
    for(let pac of this.pacientesTurnos)
    {
      if(pac.uid == paciente.uid)
      {
        finded = true;
      }
    }

    return finded;
  }

  mostrarHistoriaClinica(paciente : any)
  {
    /*this.pacienteSeleccionado = "";
    this.pacienteSeleccionado = paciente;
    this.mostrarHC = !this.mostrarHC;*/
    for (let index = 0; index < this.turnos.length; index++) {
      console.log(  this.turnos[index]);
      if(this.turnos[index].estado == "Realizado" && this.turnos[index].paciente.uid == paciente.uid)
      {
        if(this.turnos[index].historiaClinica!=undefined)
        this.historialesFiltrados.push(this.turnos[index].historiaClinica)
      } 
    }
      
    console.log(  this.historialesFiltrados);
    this.mostrarHistoriales = true
  }

  cerrarHistoriales()
  {
    this.mostrarHistoriales = false
    this.historialesFiltrados =[]
  }
  cerrarDias()
  {
    this.mostrarAtenciones = false
    this.atenciones =[]
  }


  cargarDatos()
  {
    for(let turno of this.turnos) 
    {
      if(turno.estado == "Realizado" && turno.especialista.uid == this.as.usuarioActual.uid)
      {
        if(!this.yaEstaEnArray(turno.paciente))
        {
          this.pacientesTurnos.push(turno.paciente);
        }
      }
    }
   // console.log('PACIENTES', this.pacientes); 
    console.log('PACIENTES TURNOS', this.pacientesTurnos); 

    for(let paciente of this.pacientes) 
    {
      for(let paciente2 of this.pacientesTurnos) 
      {
        if(paciente.uid == paciente2.uid)
        {

          this.pacientesFiltrados.push(paciente);
        }
      }  
    }
    console.log('PACIENTES FILTRADOS', this.pacientesFiltrados);
    this.mostrarPacientes = true;
  }

  cargarArrayDias(paciente : any)
  {

    console.log('PACIENTE ON CLICK', paciente);
    this.pacienteSeleccionado = '';
    this.pacienteSeleccionado = paciente;
    this.atenciones = [];
    this.arrayDias = [];
    if(!this.mostrarAtenciones)
    {
      for(let turno of this.turnos)
      {
        if(turno.paciente.uid == this.pacienteSeleccionado.uid && turno.estado == "Realizado" && turno.especialista.uid == this.as.usuarioActual.uid)
        {
          this.arrayDias.push(turno.fecha.dia);
          console.log(turno.fecha.dia);
        }
      }
      
      for (let i = 0; i <= 2; i++)
      {
        this.agregarAteciones();  
      }

      this.mostrarAtenciones = true;
    }
    else
    {
      this.mostrarAtenciones = false;
      this.arrayDias = [];
      this.atenciones = [];
    }
  }

  agregarAteciones()
  {
    let dia : string;
    let mes : string;
    let array : any;
    let array2  : any;
    let diaUltimo : string;
    let mesUltimo : string;
    let arrayUltimo : any;
    let array2Ultimo  : any;
    
    this.ultimaAtencion = "";

    for (let i = 0; i < this.arrayDias.length; i++) 
    {
      if(i == 0)
      {
        this.ultimaAtencion = this.arrayDias[i];
      }
      else
      {
        array = this.arrayDias[i].split(" ");
        array2 = array[1].split("/");

        dia = array2[0];
        mes = array2[1];

        arrayUltimo = this.ultimaAtencion.split(" ");
        array2Ultimo = arrayUltimo[1].split("/");

        diaUltimo = array2Ultimo[0];
        mesUltimo = array2Ultimo[1];
        
        if(dia > diaUltimo && mes == mesUltimo)
        {
          this.ultimaAtencion = this.arrayDias[i];
        }   
        else
        {
          if(dia < diaUltimo && mes > mesUltimo)
          {
            this.ultimaAtencion = this.arrayDias[i];
          }
          else
          {
            if(dia > diaUltimo && mes > mesUltimo)
            {
              this.ultimaAtencion = this.arrayDias[i];
            }
          }
        }  
      }     
    }
    if(this.ultimaAtencion != "")
    {
      let indice : number = this.arrayDias.indexOf(this.ultimaAtencion,0);

      this.arrayDias.splice(indice,1);
      this.atenciones.push(this.ultimaAtencion);
    }

  }

}
