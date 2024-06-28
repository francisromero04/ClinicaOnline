import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaturnosdisponiblesComponent } from './listaturnosdisponibles.component';

describe('ListaturnosdisponiblesComponent', () => {
  let component: ListaturnosdisponiblesComponent;
  let fixture: ComponentFixture<ListaturnosdisponiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaturnosdisponiblesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaturnosdisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
