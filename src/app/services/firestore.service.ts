import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore) { }
  traerListadoUsuarios() {
    const collection = this.angularFirestore.collection<any>('usuarios');
    return collection.valueChanges();
  }
  traerListadoAccesoRapido() {
    const collection = this.angularFirestore.collection<any>('usuarios',ref => ref.where('acceso-rapido', '==', true))
    return collection.valueChanges();
  }

}
