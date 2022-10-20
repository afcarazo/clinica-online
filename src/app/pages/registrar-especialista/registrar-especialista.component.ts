import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
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
  constructor(public fb: FormBuilder, private firestoreEspecialidad: EspecialidadesService, private imageService: ImageService, private firestore: FirestoreService, private notificacion: NotificationsService, private auth: AuthService) {
    this.especialista = new Especialista();
    this.formularioRegistro = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      edad: ['', Validators.required],
      apellido: ['', Validators.required],
      especialidad: ['', Validators.required],
      dni: ['', Validators.required],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      imagen: ['', Validators.required]
    });
    this.firestoreEspecialidad.traerListaEspecialidades().subscribe(especialidades => {
      this.especialidades = [];
      if (especialidades != null) {
        this.especialidades = especialidades;
        console.log(this.especialidades);
      }
    });
    this.formData = new FormData();
  }
  validaciones(): boolean {
    let retorno = true;
    if (this.especialista.nombre === '' ||
      this.especialista.mail === '' ||
      this.especialista.edad === 0 ||
      this.especialista.apellido === '' ||
      this.especialista.especialidad === '' ||
      this.especialista.dni === 0 ||
      this.especialista.password === '' ||
      this.especialista.fotoUno === '') {
      retorno = false;
    }
    return retorno;
  }

  ngOnInit(): void {

  }
  cargarEspecialidad(especialidadAgregar: any) {

    this.especialista.especialidad = especialidadAgregar.nombre;

    this.formularioRegistro.get("especialidad")?.setValue(especialidadAgregar.nombre);
  }
  agregarEspecialidad() {
    let especialidadNombre: string = (this.formularioRegistro.get("especialidad")?.value).toLowerCase();
    if (especialidadNombre != '') {
      let flag: boolean = false;

      this.especialidadesAgregar.push(especialidadNombre);

      for (let especialidad of this.especialidades) {
        if (especialidad.nombre == especialidadNombre) {
          flag = true;
        }
      }

      if (!flag) {
        this.firestoreEspecialidad.guardarEspecialidad(especialidadNombre);
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

      await this.imageService.subirImagen(this.fotoUno, archive1, this.especialista, 1).catch(error => {
        this.notificacion.showNotificationError('ERROR', 'Ocurrio un error al subir la primer imagen');
        retorno = false;
        console.log(error);
      });

    }
    else {
      this.notificacion.showNotificationError('ERROR', 'La foto es requerida');
    }
    return retorno;

  }

  async registrar() {

    const retorno = await this.subirFoto();

    if (retorno) {
      console.log(this.validaciones());

      if (this.validaciones()) {
        this.notificacion.showNotificationSuccess('Registrando...', 'aguarde');

        await this.auth.registrarEspecialista(this.especialista);
        console.log(this.especialista);
        setTimeout(() => {
          this.formularioRegistro.reset();
          this.especialista = new Especialista();
          }, 4000);

      }
    }

  }

}
