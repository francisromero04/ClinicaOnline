import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroadministradorComponent } from './registroadministrador.component';

describe('RegistroadministradorComponent', () => {
  let component: RegistroadministradorComponent;
  let fixture: ComponentFixture<RegistroadministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroadministradorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistroadministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
