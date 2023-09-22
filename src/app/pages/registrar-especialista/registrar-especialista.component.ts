import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Especialidad } from 'src/app/class/especialidad';
import { Especialista } from 'src/app/class/especialista';
import { AuthService } from 'src/app/services/auth.service';
import { EspecialidadesService } from 'src/app/services/especialidades.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ImageService } from 'src/app/services/image.service';
import { NotificationsService } from 'src/app/services/notifications.service';
@Component({
  selector: 'app-registrar-especialista',
  templateUrl: './registrar-especialista.component.html',
  styleUrls: ['./registrar-especialista.component.css']
})
export class RegistrarEspecialistaComponent implements OnInit {
  especialidades: any[] = [];
  formularioRegistro: FormGroup;
  especialista: Especialista;
  especialidadesAgregar: any[] = [];
  formData: FormData;
  fotoUno: any;
  spinner: boolean = false;
  numeroRandom: any;
  constructor(public fb: FormBuilder, private firestoreEspecialidad: EspecialidadesService, private imageService: ImageService, private firestore: FirestoreService, private notificacion: NotificationsService, private auth: AuthService) {
    this.especialista = new Especialista();
    this.formularioRegistro = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      edad: ['', Validators.required],
      apellido: ['', Validators.required],
      especialidad: [''],
      dni: ['', Validators.required],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      imagen: ['', Validators.required],
      capcha: ['', [Validators.required]]
    });
    this.numeroRandom = Math.floor(Math.random() * (500 - 100)) + 100;
    this.firestoreEspecialidad.traerListaEspecialidades().subscribe(especialidades => {
      this.especialidades = [];
      if (especialidades != null) {
        this.especialidades = especialidades;
        console.log(this.especialidades);
      }
    });
    this.formData = new FormData();
  }


  ngOnInit(): void {

  }
  cargarEspecialidad(especialidadAgregar: Especialidad) {

    let flag = false;
    for (let especialidad of this.especialidadesAgregar) {
      if (especialidadAgregar.nombre == especialidad.nombre) {
        flag = true;
      }
    }

    if (!flag) {
      this.especialidadesAgregar.push(especialidadAgregar);
    }
  }
  agregarEspecialidad() {
    let especialidadNombre: any = (this.formularioRegistro.get("especialidad")?.value).toLowerCase();
    if (especialidadNombre != '') {
      let flag: boolean = false;

      let especialidadCompleta: Especialidad = {
        nombre: especialidadNombre,
        foto: "https://firebasestorage.googleapis.com/v0/b/clinica-online-7c11f.appspot.com/o/icono.png?alt=media&token=d0bcc7f1-e8c4-4c78-a879-ab6c7204f201"

      }

      this.especialidadesAgregar.push(especialidadCompleta);

      for (let especialidad of this.especialidades) {
        if (especialidad.nombre == especialidadNombre) {
          flag = true;
        }
      }

      if (!flag) {
        this.firestoreEspecialidad.guardarEspecialidad(especialidadCompleta);
        this.formularioRegistro.get("especialidad")?.setValue('');
      }
    }
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
      await this.imageService.subirImagen(this.fotoUno, archive1, this.especialista, 1).catch(error => {
        this.notificacion.showNotificationError('ERROR', 'Ocurrio un error al subir la primer imagen');
        this.spinner = false;
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
        this.especialista.especialidad = this.especialidadesAgregar;
        if (this.formularioRegistro.valid) {
          this.notificacion.showNotificationSuccess('Registrando...', 'aguarde');

          console.log('ESPECIALISTA', this.especialista);
          await this.auth.registrarEspecialista(this.especialista);
          this.spinner = false;
          setTimeout(() => {
            this.formularioRegistro.reset();
            this.especialista = new Especialista();
            this.especialidadesAgregar = [];
          }, 4000);

        } else {
          this.notificacion.showNotificationError('ERROR', 'Debe completar todos los campos');
        }
        this.spinner = false;
      }
    } else {
      this.notificacion.showNotificationError('ERROR', 'Debe completar todos los campos!');
    }
  }

}
