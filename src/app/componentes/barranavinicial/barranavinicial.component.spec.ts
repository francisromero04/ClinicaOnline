import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarranavinicialComponent } from './barranavinicial.component';

describe('BarranavinicialComponent', () => {
  let component: BarranavinicialComponent;
  let fixture: ComponentFixture<BarranavinicialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarranavinicialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarranavinicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
