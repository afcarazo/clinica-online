import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from '@angular/fire/compat/firestore';
import { NotificationsService } from './notifications.service';
import { User } from '../class/user';
import { Paciente } from '../class/paciente';
import { Especialista } from '../class/especialista';
import { Administrador } from '../class/administrador';

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
              perfil: 'paciente',
              uid: data.user?.uid
            }).then(() => {
              this.notification.showNotificationSuccess('Se registro con exito', 'Verifique su correo.');
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
      this.notification.showNotificationError('ERROR', error);
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
              especialidades:especialista.especialidad,
              apellido: especialista.apellido,
              edad: especialista.edad,
              dni: especialista.dni,
              mail: especialista.mail,
              password: especialista.password,
              fotoUno: especialista.fotoUno,
              perfil: 'especialista',
              uid: data.user?.uid,
              aprobado: false
            }).then(() => {
              this.notification.showNotificationSuccess('Se registro con exito', 'Verifique su correo.');
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
      this.notification.showNotificationError('ERROR', error);
    }

  }
  async registrarAdministrador(administrador: Administrador) {
    try {
      this.auth.createUserWithEmailAndPassword(administrador.mail, administrador.password).
        then(async (data) => {
          await data.user?.sendEmailVerification();
          await this.firestore.collection('usuarios').doc(data.user?.uid).set(
            {
              nombre: administrador.nombre,
              apellido: administrador.apellido,
              edad: administrador.edad,
              dni: administrador.dni,
              mail: administrador.mail,
              password: administrador.password,
              fotoUno: administrador.fotoUno,
              perfil: 'administrador',
              uid: data.user?.uid
            }).then(() => {
              this.notification.showNotificationSuccess('Se registro con exito', 'Verifique su correo.');
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
      this.notification.showNotificationError('ERROR', error);
    }

  }

  async login(email: any, password: any) {
    var retorno: any;
    await this.auth.signInWithEmailAndPassword(email, password).then(async (ret) => {
      this.uid = ret.user?.uid
      retorno = ret;
      if (ret) {
        await this.firestore
          .collection('usuarios')
          .doc(this.uid)
          .get()
          .toPromise()
          .then(async (doc) => {

            await this.firestore
              .collection('usuarios')
              .doc(this.uid)
              .valueChanges()
              .subscribe((usuario) => {
                this.usuarioActual = usuario;
                console.log(this.usuarioActual);
              });
          })
      }
      else {
        retorno = null;
      }
    }).catch((error) => { 
      this.notification.showNotificationError('ERROR',error);
    } )
    

    return retorno;
  
  }

  async logout() {
    await this.auth.signOut();
  }
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
  habilitarEspecialista(uid: string) {
    this.firestore.collection('usuarios').doc(uid).update({ aprobado: true }).catch((error) => {
      this.notification.showNotificationError("Ocurrio un error al habilitar especialista!", error)
    }).finally(() => {
      this.notification.showNotificationSuccess("Especialista habilitado!", 'Exito');
    })
  }
  deshabilitarEspecialista(uid: string) {
    this.firestore.collection('usuarios').doc(uid).update({ aprobado: false }).catch((err) => {
      this.notification.showNotificationError("Ocurrio un error al deshabilitar especialista!", 'Error')
    }).finally(() => {
      this.notification.showNotificationSuccess("Especialista deshabilitado!", 'Exito');
    })
  }

}