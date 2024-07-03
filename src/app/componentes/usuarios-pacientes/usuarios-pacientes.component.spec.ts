import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosPacientesComponent } from './usuarios-pacientes.component';

describe('UsuariosPacientesComponent', () => {
  let component: UsuariosPacientesComponent;
  let fixture: ComponentFixture<UsuariosPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosPacientesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsuariosPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
