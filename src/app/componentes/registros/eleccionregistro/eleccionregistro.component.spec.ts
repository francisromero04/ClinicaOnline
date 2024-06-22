import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EleccionregistroComponent } from './eleccionregistro.component';

describe('EleccionregistroComponent', () => {
  let component: EleccionregistroComponent;
  let fixture: ComponentFixture<EleccionregistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EleccionregistroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EleccionregistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
