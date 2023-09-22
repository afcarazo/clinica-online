import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Administrador } from 'src/app/class/administrador';
import { AuthService } from 'src/app/services/auth.service';
import { EspecialidadesService } from 'src/app/services/especialidades.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ImageService } from 'src/app/services/image.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-registrar-admin',
  templateUrl: './registrar-admin.component.html',
  styleUrls: ['./registrar-admin.component.css']
})
export class RegistrarAdminComponent implements OnInit {

  especialidades: any[] = [];
  formularioRegistro: FormGroup;
  
  administrador: Administrador;
  formData: FormData;
  fotoUno: any;
  spinner: boolean = false;
  numeroRandom: any;
  constructor(public fb: FormBuilder, private firestoreEspecialidad: EspecialidadesService, private imageService: ImageService, private firestore: FirestoreService, private notificacion: NotificationsService, private auth: AuthService) {
    this.administrador = new Administrador();
    this.formularioRegistro = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      edad: ['', Validators.required],
      apellido: ['', Validators.required],
      especialidad: ['', Validators.required],
      dni: ['', Validators.required],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      imagen: ['', Validators.required],
      capcha: ['', [Validators.required]]
    });
    this.numeroRandom = Math.floor(Math.random() * (500 - 100)) + 100;
    this.formData = new FormData();
  }

  ngOnInit(): void {

  }
 

  change($event: any) {
    if ($event.target.files.length > 0) {
      for (let i = 0; i < $event.target.files.length; i++) {
        if (i === 0) {
          this.fotoUno = $event.target.files[i].name;
        }

        this.formData.delete(`archivo${i}`);
        this.formData.append(`archivo${i}`, $event.target.files[i], $event.target.files[i].name);
      }
    }
  }
  async subirFoto(): Promise<boolean> {
    let retorno = true;
    let archive1 = this.formData.get('archivo0');

    console.log(this.fotoUno);
    if (this.fotoUno != undefined) {
      this.fotoUno = Date.now() + this.fotoUno;
      this.spinner = true;
      await this.imageService.subirImagen(this.fotoUno, archive1, this.administrador, 1).catch(error => {
        this.notificacion.showNotificationError('ERROR', 'Ocurrio un error al subir la primer imagen');
        retorno = false;
        console.log(error);
      });
      this.spinner = false;

    }
    else {
      this.notificacion.showNotificationError('ERROR', 'La foto es requerida');
    }
    return retorno;

  }

  async registrar() {

    this.spinner = true;
    const retorno = await this.subirFoto();
    let capcha = this.formularioRegistro.get("capcha")?.value;
    if (capcha == this.numeroRandom) {

      if (retorno) {

        if (this.formularioRegistro.valid) {
          this.notificacion.showNotificationSuccess('Registrando...', 'aguarde');

          await this.auth.registrarAdministrador(this.administrador);
          this.spinner = false;
          console.log(this.administrador);
          setTimeout(() => {
            this.formularioRegistro.reset();
            this.administrador = new Administrador();
          }, 4000);

        }
        else {
          this.notificacion.showNotificationError('ERROR', 'Debe completar todos los campos!');
        }
      
      }
    } else { 
      this.notificacion.showNotificationError('ERROR', 'Debe completar todos los campos');
    }
    
    this.spinner = false;

  }


}
