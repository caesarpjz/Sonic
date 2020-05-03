import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitScheduleMonthlyComponent } from './submit-schedule-monthly.component';

describe('SubmitScheduleMonthlyComponent', () => {
  let component: SubmitScheduleMonthlyComponent;
  let fixture: ComponentFixture<SubmitScheduleMonthlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitScheduleMonthlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitScheduleMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
