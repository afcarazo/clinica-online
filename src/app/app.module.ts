import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NavBarComponent } from './pages/nav-bar/nav-bar.component';
import { LoginComponent } from './pages/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';

import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import {AngularFireModule} from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { DatePipe } from '@angular/common';
import { RegistrarPacienteComponent } from './pages/registrar-paciente/registrar-paciente.component';
import { RegistrarEspecialistaComponent } from './pages/registrar-especialista/registrar-especialista.component';
import { SeccionUsuariosComponent } from './pages/seccion-usuarios/seccion-usuarios.component';
import { RegistrarAdminComponent } from './pages/registrar-admin/registrar-admin.component';
import { PacienteEspecilistaComponent } from './pages/paciente-especilista/paciente-especilista.component';
import { SacarTurnoComponent } from './pages/sacar-turno/sacar-turno.component';
import { PerfilAccionesComponent } from './pages/perfil-acciones/perfil-acciones.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { DiaPipe } from './pipes/dia.pipe';
import { FechaPipe } from './pipes/fecha.pipe';
import { VerTurnosComponent } from './pages/ver-turnos/ver-turnos.component';
import { GestionTurnosComponent } from './pages/gestion-turnos/gestion-turnos.component';
import { SeccionPacientesComponent } from './pages/seccion-pacientes/seccion-pacientes.component';
import { GraficosComponent } from './pages/graficos/graficos.component';
import { BtnHomeDirective } from './directivas/btn-home.directive';
import { CardUsuarioDirective } from './directivas/card-usuario.directive';
import { ClickUserDirective } from './directivas/click-user.directive';
import { FormatoNombreApellidoPipe } from './pipes/formato-nombre-apellido.pipe';
import { FormatoDniPipe } from './pipes/formato-dni.pipe';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    LoginComponent,
    RegistrarPacienteComponent,
    RegistrarEspecialistaComponent,
    SeccionUsuariosComponent,
    RegistrarAdminComponent,
    PacienteEspecilistaComponent,
    SacarTurnoComponent,
    PerfilAccionesComponent,
    PerfilComponent,
    DiaPipe,
    FechaPipe,
    VerTurnosComponent,
    GestionTurnosComponent,
    SeccionPacientesComponent,
    GraficosComponent,
    BtnHomeDirective,
    CardUsuarioDirective,
    ClickUserDirective,
    FormatoNombreApellidoPipe,
    FormatoDniPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot({ preventDuplicates: true }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserAnimationsModule

  ],
  providers: [DatePipe, FechaPipe, DiaPipe, FormatoNombreApellidoPipe, FormatoDniPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
