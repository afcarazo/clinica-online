import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {

  constructor(private angularFirestore: AngularFirestore) { }

  guardarEspecialidad(especialidadGuardar: any) { 
  
    this.angularFirestore.collection<any>('especialidades').add(especialidadGuardar).then((res) => res.id);
  }


  traerListaEspecialidades() {
    let collection = this.angularFirestore.collection<any>('especialidades');
    return collection.valueChanges();
  }


}
