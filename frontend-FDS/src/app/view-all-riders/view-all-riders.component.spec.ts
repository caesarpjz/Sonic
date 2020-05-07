import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllRidersComponent } from './view-all-riders.component';

describe('ViewAllRidersComponent', () => {
  let component: ViewAllRidersComponent;
  let fixture: ComponentFixture<ViewAllRidersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllRidersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllRidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
