import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministradorGuard } from './guards/administrador.guard';
import { LoggedInGuard } from './guards/logged-in.guard';
import { GestionTurnosComponent } from './pages/gestion-turnos/gestion-turnos.component';
import { GraficosComponent } from './pages/graficos/graficos.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PacienteEspecilistaComponent } from './pages/paciente-especilista/paciente-especilista.component';
import { PerfilAccionesComponent } from './pages/perfil-acciones/perfil-acciones.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RegistrarAdminComponent } from './pages/registrar-admin/registrar-admin.component';
import { RegistrarEspecialistaComponent } from './pages/registrar-especialista/registrar-especialista.component';
import { RegistrarPacienteComponent } from './pages/registrar-paciente/registrar-paciente.component';
import { SacarTurnoComponent } from './pages/sacar-turno/sacar-turno.component';
import { SeccionPacientesComponent } from './pages/seccion-pacientes/seccion-pacientes.component';
import { SeccionUsuariosComponent } from './pages/seccion-usuarios/seccion-usuarios.component';
import { VerTurnosComponent } from './pages/ver-turnos/ver-turnos.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'registrar-paciente', component: RegistrarPacienteComponent },
  { path: 'registrar-especialista', component: RegistrarEspecialistaComponent },
  { path: 'usuarios', component: SeccionUsuariosComponent, canActivate:[AdministradorGuard] },
  { path: 'registrar-administrador', component: RegistrarAdminComponent },
  { path: 'registrar', component: PacienteEspecilistaComponent },
  { path: 'sacar-turno', component: SacarTurnoComponent },
  { path: 'perfil-seccion', component: PerfilAccionesComponent, canActivate:[LoggedInGuard] },
  { path: 'mi-perfil', component: PerfilComponent, canActivate:[LoggedInGuard] },
  { path: 'turnos', component: VerTurnosComponent, canActivate:[LoggedInGuard] },
  { path: 'gestion-turnos', component: GestionTurnosComponent, canActivate:[LoggedInGuard] },
  { path: 'graficos', component: GraficosComponent, canActivate:[LoggedInGuard] },
  { path: 'seccion-pacientes', component: SeccionPacientesComponent
  , canActivate:[LoggedInGuard] },
  {path:'login', component:LoginComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
