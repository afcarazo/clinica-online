import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteEspecilistaComponent } from './paciente-especilista.component';

describe('PacienteEspecilistaComponent', () => {
  let component: PacienteEspecilistaComponent;
  let fixture: ComponentFixture<PacienteEspecilistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PacienteEspecilistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteEspecilistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
