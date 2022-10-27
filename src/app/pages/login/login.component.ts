import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/class/user';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User;
  formularioLogin: FormGroup;
  listadoUsuarioAccesoRapido: any[] = [];
  ingresoRapido: boolean = false;
  spinner: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificacionesService: NotificationsService,
    public fb: FormBuilder, private firestoreService: FirestoreService
  ) {
    this.user = new User();
    this.formularioLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {

    this.firestoreService.traerListadoAccesoRapido().subscribe(usuarios => {
      if (usuarios != null) {
        this.listadoUsuarioAccesoRapido = usuarios;
      }
    })

  }
  cargarPerfil(perfil: any) {
    this.formularioLogin.get('email')?.setValue(perfil.mail);
    this.formularioLogin.get('password')?.setValue(perfil.password);
  }
  navegarRegistrar() {
    this.router.navigateByUrl('registrar');
  }

  async login() {
    try {
      if (this.user.email != '' && this.user.password != '') {
        this.spinner = true;
        await this.authService.login(this.user.email, this.user.password).then((data) => {
          let aprobado = this.authService.usuarioActual.aprobado;
          console.log('APROBADO', aprobado);
          if (data?.user?.emailVerified) {
            if (aprobado || this.authService.usuarioActual.perfil == 'paciente') {
              this.spinner = false;
              this.notificacionesService.showNotificationSuccess('Login exitoso!', 'Redirigiendo a home!');
              setTimeout(() => { this.router.navigateByUrl('', { replaceUrl: true }); }, 2000);
            }
            if (!aprobado && this.authService.usuarioActual.perfil == 'especialista') {
              this.spinner = false;
              this.notificacionesService.showNotificationError('ERROR!', 'Primero deberia ser aprobado por un administrador!');
              this.authService.logout();
              
            }
          }
          else {
            this.notificacionesService.showNotificationError('ERROR', 'Primero verifica tu cuenta!');
            this.authService.logout();
          }
        })

      } else {
        this.notificacionesService.showNotificationError('Campos vacios', 'Por favor llene todos los campos.');
      }
    } catch (error) {
      console.log('Ocurrio un error');
      console.log(error);
    }
  }

  async loginRapido() {

    if (this.user.email != '' && this.user.password != '') {
      this.spinner = true;
      await this.authService.login(this.user.email, this.user.password).then((data) => {
        this.spinner = false;
        this.notificacionesService.showNotificationSuccess('Login exitoso!', 'Redirigiendo a home!');
        setTimeout(() => { this.router.navigateByUrl('', { replaceUrl: true }); }, 2000);
      }).catch(error => { 
        this.spinner = false;
        this.notificacionesService.showNotificationError('ERROR',error);
      })
    }

  }

  quickLogin() {
    this.user.email = 'admin@admin.com';
    this.user.password = '111111';
  }
  quickLoginEmpleado() {
    this.user.email = 'empleado@empleado.com';
    this.user.password = '222222';
  }



}
