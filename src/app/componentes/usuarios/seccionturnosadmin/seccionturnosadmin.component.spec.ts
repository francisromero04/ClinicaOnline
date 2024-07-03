import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionturnosadminComponent } from './seccionturnosadmin.component';

describe('SeccionturnosadminComponent', () => {
  let component: SeccionturnosadminComponent;
  let fixture: ComponentFixture<SeccionturnosadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionturnosadminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeccionturnosadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
