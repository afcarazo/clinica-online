import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrarEspecialistaComponent } from './pages/registrar-especialista/registrar-especialista.component';
import { RegistrarPacienteComponent } from './pages/registrar-paciente/registrar-paciente.component';
import { SeccionUsuariosComponent } from './pages/seccion-usuarios/seccion-usuarios.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'registrar-paciente', component: RegistrarPacienteComponent },
  { path: 'registrar-especialista', component: RegistrarEspecialistaComponent },
  { path: 'usuarios', component: SeccionUsuariosComponent },
  {path:'login', component:LoginComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
