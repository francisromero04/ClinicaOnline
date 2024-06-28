import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecialistaComponent } from './especialista.component';

describe('EspecialistaComponent', () => {
  let component: EspecialistaComponent;
  let fixture: ComponentFixture<EspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspecialistaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
