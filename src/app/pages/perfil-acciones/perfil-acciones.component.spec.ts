import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilAccionesComponent } from './perfil-acciones.component';

describe('PerfilAccionesComponent', () => {
  let component: PerfilAccionesComponent;
  let fixture: ComponentFixture<PerfilAccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilAccionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilAccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
