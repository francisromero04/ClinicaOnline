import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecialistaNavbarComponent } from './especialista-navbar.component';

describe('EspecialistaNavbarComponent', () => {
  let component: EspecialistaNavbarComponent;
  let fixture: ComponentFixture<EspecialistaNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspecialistaNavbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EspecialistaNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
