import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Especialidad } from '../class/especialidad';
import { Horario } from '../class/horario';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore) { }
  traerListadoUsuarios() {
    const collection = this.angularFirestore.collection<any>('usuarios');
    return collection.valueChanges();
  }
  traerIngresos() {
    const collection = this.angularFirestore.collection<any>('Ingresos');
    return collection.valueChanges();
  }
  traerListadoAccesoRapido() {
    const collection = this.angularFirestore.collection<any>('usuarios',ref => ref.where('acceso-rapido', '==', true))
    return collection.valueChanges();
  }
  traerListadoAEspecialistas() {
    const collection = this.angularFirestore.collection<any>('usuarios',ref => ref.where('perfil', '==', 'especialista'))
    return collection.valueChanges();
  }
  traerPacientes() {
    const collection = this.angularFirestore.collection<any>('usuarios',ref => ref.where('perfil', '==', 'paciente'))
    return collection.valueChanges();
  }
  traerListadoEspecilidades() {
    const collection = this.angularFirestore.collection<any>('especialidades');
    return collection.valueChanges();
  }
  agregarHorario(horario : Horario)
  {
    return this.angularFirestore.collection<any>('horarios').add({...horario});
  }

  modificarHorario(horario : any, id : any)
  {
    return this.angularFirestore.collection<any>('horarios').doc(id).update({...horario});
  }
 
  traerHorarios()
  {
    return this.angularFirestore.collection<any>('horarios').valueChanges({idField : 'id'})
  }
  traerLogs()
  {
    return this.angularFirestore.collection<any>('Ingresos').valueChanges({idField : 'id'})
  }
  traerTurnos()
  {
    return this.angularFirestore.collection<any>('turnos').valueChanges({idField : 'id'})
  }

  agregarTurno(turno : any)
  {
    return this.angularFirestore.collection<any>('turnos').add({...turno});
  }

  modificarTurno(turno : any, id : any)
  {
    return this.angularFirestore.collection<any>('turnos').doc(id).update({...turno});
  }
  
  
  modificarPaciente(paciente : any, id : any)
  {
    return this.angularFirestore.collection('usuarios').doc(id).update(paciente);
  }

}
