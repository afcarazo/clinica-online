import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  activo: boolean=false;
  administrador: boolean = false;
  paciente: boolean = false;
  especialista: boolean = false;
  constructor(private router: Router, public auth: AuthService) {
    if (this.auth.usuarioActual) {
      this.activo = this.auth.sesionActiva;
      if (this.auth.usuarioActual != undefined) {
        if (this.auth.usuarioActual.perfil === "administrador") {
          this.administrador = true;
        }
        else if (this.auth.usuarioActual.perfil === "paciente") {
          this.paciente = true;
        }
        else if (this.auth.usuarioActual.perfil === "especialista") {
          this.especialista = true;
        }
      }
    }
  }
  ngOnInit(): void {
  }
  navegarALogin() { 
    this.router.navigateByUrl('login');
  }
  navegarAdminUsuarios() { 
    this.router.navigateByUrl('usuarios');
  }
  navegarSacarTurno() { 
    this.router.navigateByUrl('sacar-turno');
  }
  navegarSeccionPaciente() { 
    this.router.navigateByUrl('seccion-pacientes');
  }
  navegarGraficos() { 
    this.router.navigateByUrl('graficos');
  }

  cerrarSesion() {
    this.activo = this.auth.sesionActiva;
    this.auth.logout();
    this.router.navigateByUrl('');
    window.location.reload;
   }
}
