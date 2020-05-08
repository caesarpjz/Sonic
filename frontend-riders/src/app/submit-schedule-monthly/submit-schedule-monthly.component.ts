import { AlertService } from './../services/alert.service';
import { ScheduleService } from './../services/schedule.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

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

  constructor(private formBuilder: FormBuilder,
    private scheduleService: ScheduleService,
    private alertService: AlertService) {
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

    let schedule = {
      'shiftArray': []
    };


    for (var idx = 4; idx > 0; idx--) {
      this.scheduleForm.value.items.map((day) => {
        let dayNum = 0;

        switch (day.day) {
          case 'sunday':
            dayNum = 0;
            break;
          case 'monday':
            dayNum = 1;
            break;
          case 'tuesday':
            dayNum = 2;
            break;
          case 'wednesday':
            dayNum = 3;
            break;
          case 'thursday':
            dayNum = 4;
            break;
          case 'friday':
            dayNum = 5;
            break;
          case 'saturday':
            dayNum = 6;
            break;
        }


        // if week 1, add +7
        // if week 2, add +14

        switch(idx) {
          case 4:
            if (day.week === 1) {
              dayNum += 7;
            } else {
              dayNum += 14;
            }
            break;
          case 3:
            if (day.week === 1) {
              dayNum += 14;
            } else {
              dayNum += 21;
            }
            break;
          case 2:
            if (day.week === 1) {
              dayNum += 21;
            } else {
              dayNum += 28;
            }
            break;
          case 1:
            if (day.week === 1) {
              dayNum += 28;
            } else {
              dayNum += 35;
            }
            break;
        }

        // console.log('shift array', this.shiftTimeInfo[day.shift]);

        for (var i = 0; i < this.shiftTimeInfo[day.shift].length; i++) {

          let shift = {
            'start_time': moment().day(dayNum).hour(this.shiftTimeInfo[day.shift][i].startTime).minute(0).second(0).format(),
            'end_time': moment().day(dayNum).hour(this.shiftTimeInfo[day.shift][i].endTime).minute(0).second(0).format(),
          }

          schedule.shiftArray.push(shift);
        }

        // console.log(schedule);
      });
    }

    this.scheduleService.submitSchedule(schedule).subscribe((res) => {
      this.alertService.success('Shifts successfully added!');
    });
  }

}
