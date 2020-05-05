import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllMenusComponent } from './view-all-menus.component';

describe('ViewAllMenusComponent', () => {
  let component: ViewAllMenusComponent;
  let fixture: ComponentFixture<ViewAllMenusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllMenusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
