import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuFoodCardComponent } from './menu-food-card.component';

describe('MenuFoodCardComponent', () => {
  let component: MenuFoodCardComponent;
  let fixture: ComponentFixture<MenuFoodCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuFoodCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuFoodCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
