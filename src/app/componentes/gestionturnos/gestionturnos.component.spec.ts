import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionturnosComponent } from './gestionturnos.component';

describe('GestionturnosComponent', () => {
  let component: GestionturnosComponent;
  let fixture: ComponentFixture<GestionturnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionturnosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionturnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
