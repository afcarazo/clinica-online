import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  activo: boolean;
  administrador: boolean=false;
  constructor(private router: Router, private auth: AuthService) {
    this.activo = this.auth.sesionActiva;
    if (this.auth.usuarioActual !=undefined ) {
      if (this.auth.usuarioActual.perfil === "administrador") { 
        this.administrador = true;
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

  cerrarSesion() {
    this.activo = this.auth.sesionActiva;
    this.auth.logout();
    this.router.navigateByUrl('');
    window.location.reload;
   }
}
