import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NotificationsService } from './notifications.service';
import { User } from '../class/user';
import { Paciente } from '../class/paciente';
import { Especialista } from '../class/especialista';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: any;
  sesionActiva: any = false;
  uid: any;
  usuarioActual: any;
  constructor(private auth: AngularFireAuth, private notification: NotificationsService, private datepipe: DatePipe, private router: Router, private firestore: AngularFirestore) {
    auth.authState.subscribe(user => (this.sesionActiva = user));
  }

  resetPassword({ email }: any) {
    try {
      return this.auth.sendPasswordResetEmail(email);
    } catch (error) {
      return null;
    }
  }
  async registerPaciente(paciente: Paciente) {
    try {
      this.auth.createUserWithEmailAndPassword(paciente.mail, paciente.password).
        then(async (data) => {
          await data.user?.sendEmailVerification();
          await this.firestore.collection('usuarios').doc(data.user?.uid).set(
            {
              nombre: paciente.nombre,
              apellido: paciente.apellido,
              edad: paciente.edad,
              dni: paciente.dni,
              obraSocial: paciente.obraSocial,
              mail: paciente.mail,
              password: paciente.password,
              fotoUno: paciente.fotoUno,
              fotoDos: paciente.fotoDos,
              perfil:  paciente.perfil
            }).then(() => { 
              this.notification.showNotificationSuccess('Se registro con exito','Verifique su correo.');
            })

        }).catch(error => {
          if (error.code == 'auth/email-already-in-use') {
            this.notification.showNotificationError(
              'ERROR',
              'El usuario ya existe!'
            );
          } else {
            this.notification.showNotificationError(
              'ERROR',
              error.code
            );
          }
        })
    } catch (error) {
      this.notification.showNotificationError('ERROR',error);
     }
    
  }
 
  async registrarEspecialista(especialista: Especialista) {
    try {
      this.auth.createUserWithEmailAndPassword(especialista.mail, especialista.password).
        then(async (data) => {
          await data.user?.sendEmailVerification();
          await this.firestore.collection('usuarios').doc(data.user?.uid).set(
            {
              nombre: especialista.nombre,
              apellido: especialista.apellido,
              edad: especialista.edad,
              dni: especialista.dni,
              mail: especialista.mail,
              password: especialista.password,
              fotoUno: especialista.fotoUno,
              perfil:especialista.perfil
            }).then(() => { 
              this.notification.showNotificationSuccess('Se registro con exito','Verifique su correo.');
            })

        }).catch(error => {
          if (error.code == 'auth/email-already-in-use') {
            this.notification.showNotificationError(
              'ERROR',
              'El usuario ya existe!'
            );
          } else {
            this.notification.showNotificationError(
              'ERROR',
              error.code
            );
          }
        })
    } catch (error) {
      this.notification.showNotificationError('ERROR',error);
     }
    
  }
 
  async login(email: any, password: any) {
    try {
      const user = await this.auth.signInWithEmailAndPassword(email, password).catch(async (error) => {
        if (user)
        {
          this.uid = user.user?.uid;
         }
        if (error.code == 'auth/wrong-password') {

          this.notification.showNotificationError('ERROR', 'Email/contraseña incorrecta. Intente nuevamente!');
        } else {
          this.notification.showNotificationError('ERROR', error.message);
        }

      })
      return user;
    } catch (error) {
      return null;
    }

  }
  logout() {
    return this.auth.signOut();
  }
  /*async googleLogin() {
    try {
      return this.auth.signInWithPopup(new GoogleAuthProvider);
    } catch (error) {
      return null;
    }
  }*/
  isLogin(user: any) {

    try {
      return this.auth.onAuthStateChanged(user);
    } catch (error) {
      return null;
    }
  }
  getCurrentUser() {
    const user = this.auth.currentUser;
    return user;
  }

  getUser() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.user.id = user.uid;
        this.user.email = user.email;
        return user.uid;
      }
      else {
        return null;
      }
    })
  }
  getName(email: string): string {
    let name = '';
    for (let index = 0; index < email.length; index++) {
      if (email[index] != "@") {
        if (index == 0) {
          name += email[index].toUpperCase();
        } else {
          name += email[index];

        }
      }
      else {
        break;
      }
    }
    return name;
  }
}