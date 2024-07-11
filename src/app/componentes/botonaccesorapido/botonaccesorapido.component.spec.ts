import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonaccesorapidoComponent } from './botonaccesorapido.component';

describe('BotonaccesorapidoComponent', () => {
  let component: BotonaccesorapidoComponent;
  let fixture: ComponentFixture<BotonaccesorapidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonaccesorapidoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BotonaccesorapidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
