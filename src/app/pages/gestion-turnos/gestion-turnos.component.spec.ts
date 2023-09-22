import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTurnosComponent } from './gestion-turnos.component';

describe('GestionTurnosComponent', () => {
  let component: GestionTurnosComponent;
  let fixture: ComponentFixture<GestionTurnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionTurnosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
