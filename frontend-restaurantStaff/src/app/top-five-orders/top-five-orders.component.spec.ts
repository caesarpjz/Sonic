import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopFiveOrdersComponent } from './top-five-orders.component';

describe('TopFiveOrdersComponent', () => {
  let component: TopFiveOrdersComponent;
  let fixture: ComponentFixture<TopFiveOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopFiveOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopFiveOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
