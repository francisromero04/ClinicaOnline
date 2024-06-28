import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisturnosgeneralComponent } from './misturnosgeneral.component';

describe('MisturnosgeneralComponent', () => {
  let component: MisturnosgeneralComponent;
  let fixture: ComponentFixture<MisturnosgeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisturnosgeneralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MisturnosgeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
