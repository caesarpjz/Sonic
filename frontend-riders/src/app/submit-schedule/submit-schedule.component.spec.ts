import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitScheduleComponent } from './submit-schedule.component';

describe('SubmitScheduleComponent', () => {
  let component: SubmitScheduleComponent;
  let fixture: ComponentFixture<SubmitScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
