import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFoodItemComponent } from './review-food-item.component';

describe('ReviewFoodItemComponent', () => {
  let component: ReviewFoodItemComponent;
  let fixture: ComponentFixture<ReviewFoodItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewFoodItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewFoodItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
