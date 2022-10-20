import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable, uploadString } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private angularFireStorage: AngularFireStorage) { }


  async subirImagen(nombre: any, dataUrl: any, usuario: any, imagenNumero: number) {
    let storage = getStorage();
    let storageRef = ref(storage, nombre);

    await uploadBytesResumable(storageRef, dataUrl).then(async () => {

      await getDownloadURL(storageRef).then((url1: any) => {
        if (imagenNumero === 1) {
          usuario.fotoUno = url1;
        }
        else if (imagenNumero === 2) {
          usuario.fotoDos = url1;
        }
      })

    });

  }

}
