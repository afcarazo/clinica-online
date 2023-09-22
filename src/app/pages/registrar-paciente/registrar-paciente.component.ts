import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Paciente } from 'src/app/class/paciente';
import { User } from 'src/app/class/user';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ImageService } from 'src/app/services/image.service';
import { FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable, uploadString } from "firebase/storage";
import { NotificationsService } from 'src/app/services/notifications.service';
@Component({
  selector: 'app-registrar-paciente',
  templateUrl: './registrar-paciente.component.html',
  styleUrls: ['./registrar-paciente.component.css']
})
export class RegistrarPacienteComponent implements OnInit {
  formularioRegistro: FormGroup;
  paciente: Paciente;
  fotoUno: any;
  fotoDos: any;
  spinner: boolean = false;
  formData: FormData;
  numeroRandom: any;
  constructor(public fb: FormBuilder, private imageService: ImageService, private firestore: FirestoreService, private auth: AuthService, private notificacion: NotificationsService) {
    this.paciente = new Paciente();
    this.formularioRegistro = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      edad: ['', Validators.required],
      apellido: ['', Validators.required],
      obraSocial: ['', Validators.required],
      dni: ['', Validators.required],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      imagen: ['', Validators.required],
      capcha: ['', [Validators.required]],
    });
    this.formData = new FormData();
    this.numeroRandom = Math.floor(Math.random() * (500 - 100)) + 100;

  }




  ngOnInit(): void {

  }



  change($event: any) {
    if ($event.target.files.length > 0) {
      for (let i = 0; i < $event.target.files.length; i++) {
        if (i === 0) {
          this.fotoUno = $event.target.files[i].name;
        }
        else {
          this.fotoDos = $event.target.files[i].name;
        }

        this.formData.delete(`archivo${i}`);
        this.formData.append(`archivo${i}`, $event.target.files[i], $event.target.files[i].name);
      }
    }
  }
  async subirFoto(): Promise<boolean> {
    let retorno = true;
    let archive1 = this.formData.get('archivo0');
    let archive2 = this.formData.get('archivo1');

    console.log(this.fotoUno, this.fotoDos);
    if (this.fotoUno != undefined && this.fotoDos != undefined) {
      this.fotoUno = Date.now() + this.fotoUno;
      this.fotoDos = Date.now() + this.fotoDos;
      this.spinner = true;
      await this.imageService.subirImagen(this.fotoUno, archive1, this.paciente, 1).catch(error => {
        this.notificacion.showNotificationError('ERROR', 'Ocurrio un error al subir la primer imagen');
        retorno = false;
        console.log(error);
      });
      await this.imageService.subirImagen(this.fotoDos, archive2, this.paciente, 2).catch(error => {
        this.notificacion.showNotificationError('ERROR', 'Ocurrio un error al subir la segunda imagen');
        console.log(error);
        retorno = false;
      });
      this.spinner = false;

    }
    else {
      retorno = false;
      this.notificacion.showNotificationError('ERROR', 'Son requeridas dos fotos.');
    }
    return retorno;

  }
  async registrar() {
    let capcha = this.formularioRegistro.get("capcha")?.value;
    if (capcha == this.numeroRandom) {
      const retorno = await this.subirFoto();
      if (retorno) {
        if (this.formularioRegistro.valid) {
          this.spinner = true;
          this.notificacion.showNotificationSuccess('Registrando...', 'aguarde');
          await this.auth.registerPaciente(this.paciente);
          setTimeout(() => {
            this.formularioRegistro.reset();
            this.paciente = new Paciente();
          }, 4000);

        } else {
          this.spinner = false;
          this.notificacion.showNotificationError('ERROR', 'Debe completar todos los campos!');
        }
      }
    }
    else { 
      this.notificacion.showNotificationError('ERROR', 'El captcha no coincide!');
    }
    this.spinner = false;
  }


}
