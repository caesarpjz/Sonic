import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-submit-schedule-monthly',
  templateUrl: './submit-schedule-monthly.component.html',
  styleUrls: ['./submit-schedule-monthly.component.css']
})
export class SubmitScheduleMonthlyComponent implements OnInit {

  workDaysChosen: any;
  shiftChosen: any;

  workDayOptions = [
    {
      label: 'Monday to Friday',
      value: [
        { day: 'monday', week: 1, times: [] },
        { day: 'tuesday', week: 1, times: [] },
        { day: 'wednesday', week: 1, times: [] },
        { day: 'thursday', week: 1, times: [] },
        { day: 'friday', week: 1, times: [] }
      ]
    },
    {
      label: 'Tuesday to Saturday',
      value: [
        { day: 'tuesday', week: 1, times: [] },
        { day: 'wednesday', week: 1, times: [] },
        { day: 'thursday', week: 1, times: [] },
        { day: 'friday', week: 1, times: [] },
        { day: 'saturday', week: 1, times: [] }
      ]
    },
    {
      label: 'Wednesday to Sunday',
      value: [
        { day: 'wednesday', week: 1, times: [] },
        { day: 'thursday', week: 1, times: [] },
        { day: 'friday', week: 1, times: [] },
        { day: 'saturday', week: 1, times: [] },
        { day: 'sunday', week: 1, times: [] }
      ]
    },
    {
      label: 'Thursday to Monday',
      value: [
        { day: 'thursday', week: 1, times: [] },
        { day: 'friday', week: 1, times: [] },
        { day: 'saturday', week: 1, times: [] },
        { day: 'sunday', week: 1, times: [] },
        { day: 'monday', week: 2, times: [] }
      ]
    },
    {
      label: 'Friday to Tuesday',
      value: [
        { day: 'friday', week: 1, times: [] },
        { day: 'saturday', week: 1, times: [] },
        { day: 'sunday', week: 1, times: [] },
        { day: 'monday', week: 2, times: [] },
        { day: 'tuesday', week: 2, times: [] }
      ]
    },
    {
      label: 'Saturday to Wednesday',
      value: [
        { day: 'saturday', week: 1, times: [] },
        { day: 'sunday', week: 1, times: [] },
        { day: 'monday', week: 2, times: [] },
        { day: 'tuesday', week: 2, times: [] },
        { day: 'wednesday', week: 2, times: [] }
      ]
    },
    {
      label: 'Sunday to Thursday',
      value: [
        { day: 'sunday', week: 1, times: [] },
        { day: 'monday', week: 2 , times: [] },
        { day: 'tuesday', week: 2, times: [] },
        { day: 'wednesday', week: 2, times: [] },
        { day: 'thursday', week: 2, times: [] }
      ]
    }
  ];

  shiftTimeInfo = {
    1: [
      { startTime: 10, endTime: 14 },
      { startTime: 15, endTime: 19 }
    ],
    2: [
      { startTime: 11, endTime: 15 },
      { startTime: 16, endTime: 20 }
    ],
    3: [
      { startTime: 12, endTime: 16 },
      { startTime: 17, endTime: 21 }
    ],
    4: [
      { startTime: 13, endTime: 17 },
      { startTime: 18, endTime: 22 }
    ]
  };

  shiftOptions = [
    {
      label: 'Shift 1',
      value: 1
    },
    {
      label: 'Shift 2',
      value: 2
    },
    {
      label: 'Shift 3',
      value: 3
    },
    {
      label: 'Shift 4',
      value: 4
    }
  ];

  scheduleForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.initScheduleForm();
  }

  initScheduleForm() {
    this.scheduleForm = this.formBuilder.group({
      items: this.formBuilder.array([], [ Validators.required ])
    });
  }

  get scheduleData() { return this.scheduleForm.get('items') as FormArray; }

  changeScheduleDays(): void {
    // reset data
    this.scheduleData.controls.length = 0;

    this.workDaysChosen.forEach((day) => {
      const workDay = this.formBuilder.group({
        day: day.day,
        week: day.week,
        shift: new FormControl('', [ Validators.required ])
      });

      this.scheduleData.push(workDay);
    });
  }

  submit() {
    console.log(this.scheduleForm);
  }

}
