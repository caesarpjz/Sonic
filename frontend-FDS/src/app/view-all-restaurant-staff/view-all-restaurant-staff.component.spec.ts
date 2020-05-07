import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllRestaurantStaffComponent } from './view-all-restaurant-staff.component';

describe('ViewAllRestaurantStaffComponent', () => {
  let component: ViewAllRestaurantStaffComponent;
  let fixture: ComponentFixture<ViewAllRestaurantStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllRestaurantStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllRestaurantStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
