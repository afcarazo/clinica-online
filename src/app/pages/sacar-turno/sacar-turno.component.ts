import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-sacar-turno',
  templateUrl: './sacar-turno.component.html',
  styleUrls: ['./sacar-turno.component.css']
})
export class SacarTurnoComponent implements OnInit {

  listadoEspecialitas: any[] = [];
  listadoEspecialidades: any[] = [];
  flagEspecialista: boolean = false;
  constructor(private firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.firestoreService.traerListadoAEspecialistas().subscribe(usuarios => {
      if (usuarios != null) {
        this.listadoEspecialitas = usuarios;
      }
    })
    this.firestoreService.traerListadoEspecilidades().subscribe(especialidades => {
      if (especialidades != null) {
        this.listadoEspecialidades = especialidades;
      }
    })

  }

}
