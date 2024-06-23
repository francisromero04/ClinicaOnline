import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDeEspecialistasComponent } from './gestion-de-especialistas.component';

describe('GestionDeEspecialistasComponent', () => {
  let component: GestionDeEspecialistasComponent;
  let fixture: ComponentFixture<GestionDeEspecialistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionDeEspecialistasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionDeEspecialistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
