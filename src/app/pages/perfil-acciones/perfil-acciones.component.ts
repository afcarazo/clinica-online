import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-perfil-acciones',
  templateUrl: './perfil-acciones.component.html',
  styleUrls: ['./perfil-acciones.component.css']
})
export class PerfilAccionesComponent implements OnInit {

  userSesion: boolean = false;
  userActual: any;
  constructor(private auth: AuthService, private router:Router) {
    this.userSesion = this.auth.sesionActiva;
    this.userActual = this.auth.usuarioActual;
  }
  navegarHacia(opcion:number) {
    switch (opcion) { 
      case 1:
        this.router.navigate(['/mi-perfil']);
        break;
      case 2:
        this.router.navigate(['turnos']);
        break;
      case 3:
        this.router.navigate(['gestion-turnos']);
        break;
    }

   }


  ngOnInit(): void {
  }

}
