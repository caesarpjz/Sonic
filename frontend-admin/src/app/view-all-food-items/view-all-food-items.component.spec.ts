import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllFoodItemsComponent } from './view-all-food-items.component';

describe('ViewAllFoodItemsComponent', () => {
  let component: ViewAllFoodItemsComponent;
  let fixture: ComponentFixture<ViewAllFoodItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllFoodItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllFoodItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
