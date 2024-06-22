import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistropacienteComponent } from './registropaciente.component';

describe('RegistropacienteComponent', () => {
  let component: RegistropacienteComponent;
  let fixture: ComponentFixture<RegistropacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistropacienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistropacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
