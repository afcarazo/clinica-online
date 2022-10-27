import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-seccion-usuarios',
  templateUrl: './seccion-usuarios.component.html',
  styleUrls: ['./seccion-usuarios.component.css']
})
export class SeccionUsuariosComponent implements OnInit {

  listadoUsuarios: any[] =[];
  constructor(private firestoreService: FirestoreService, private router:Router,private auth:AuthService) { }

  ngOnInit(): void {
    this.firestoreService.traerListadoUsuarios().subscribe(usuarios => {
      if (usuarios != null) {
        this.listadoUsuarios = usuarios;
      }
    })
  }
  navegarARegistroPaciente()
  {
    this.router.navigateByUrl('registrar-paciente');
    
  }
  
  navegarARegistroEspecialista()
  {
    this.router.navigateByUrl('registrar-especialista');
  }
  navegarARegistroAdministrador()
  {
    this.router.navigateByUrl('registrar-administrador');
  }

  habilitarEspecialista(uid: string) {
    console.log(uid);
    this.auth.habilitarEspecialista(uid);
   }
  deshabilitarEspecialista(uid: string) {
    console.log(uid);
    this.auth.deshabilitarEspecialista(uid);
   }
}
