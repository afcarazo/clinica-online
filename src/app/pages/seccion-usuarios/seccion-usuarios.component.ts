import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-seccion-usuarios',
  templateUrl: './seccion-usuarios.component.html',
  styleUrls: ['./seccion-usuarios.component.css']
})
export class SeccionUsuariosComponent implements OnInit {

  listadoUsuarios: any[] =[];
  constructor(private firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.firestoreService.traerListadoUsuarios().subscribe(usuarios => {
      if (usuarios != null) {
        this.listadoUsuarios = usuarios;
      }
    })
  }
}
