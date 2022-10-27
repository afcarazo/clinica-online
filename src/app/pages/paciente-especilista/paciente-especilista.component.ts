import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paciente-especilista',
  templateUrl: './paciente-especilista.component.html',
  styleUrls: ['./paciente-especilista.component.css']
})
export class PacienteEspecilistaComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  navegarAregistroPaciente() { 
    this.router.navigateByUrl('registrar-paciente');
  }
  navegarAregistroEspecialista() {
    this.router.navigateByUrl('registrar-especialista');

   }

}
