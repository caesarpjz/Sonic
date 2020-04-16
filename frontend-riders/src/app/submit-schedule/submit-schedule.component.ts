import { FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-submit-schedule',
  templateUrl: './submit-schedule.component.html',
  styleUrls: ['./submit-schedule.component.css']
})
export class SubmitScheduleComponent implements OnInit {
  availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  availableHours = [
    { label: 'Select', value: null },
    { label: '10am', value: 10 },
    { label: '11am', value: 11 },
    { label: '12pm', value: 12 },
    { label: '1pm', value: 13 },
    { label: '2pm', value: 14 },
    { label: '3pm', value: 15 },
    { label: '4pm', value: 16 },
    { label: '5pm', value: 17 },
    { label: '6pm', value: 18 },
    { label: '7pm', value: 19 },
    { label: '8pm', value: 20 },
    { label: '9pm', value: 21 },
    { label: '10pm', value: 22 }
  ];

  selectedDays: string[] = ['monday'];

  startTime: any;
  endTime: any;

  intervalError = false;
  totalHourError = false;

  scheduleForm: FormGroup;
  items: FormArray;
  times: FormArray;

  constructor(private formBuilder: FormBuilder) {
  }

  // [{"day":0,"hours":[2,3,4,7,12,15]},{"day":1,"hours":[]},{"day":2,"hours":[]},{"day":3,"hours":[]},{"day":4,"hours":[]},{"day":5,"hours":[]},{"day":6,"hours":[]}]

  ngOnInit() {
    this.scheduleForm = this.formBuilder.group({
      items: this.formBuilder.array([ this.createItem('monday') ])
    })

    // this.scheduleForm = this.formBuilder.group({
    //   monday: this.formBuilder.array([this.createItem()]),
    //   tuesday: this.formBuilder.array([this.createItem()]),
    //   wednesday: this.formBuilder.array([this.createItem()]),
    //   thursday: this.formBuilder.array([this.createItem()]),
    //   friday: this.formBuilder.array([this.createItem()]),
    //   saturday: this.formBuilder.array([this.createItem()]),
    //   sunday: this.formBuilder.array([this.createItem()])
    // })
  }

  // creates days containing an array of time slots
  createItem(day): FormGroup {
    return this.formBuilder.group({
      day: day,
      times: this.formBuilder.array([ this.createTimes() ])
    })
  }

  createTimes(): FormGroup {
    return this.formBuilder.group({
      startTime: '',
      endTime: ''
    }, { validator: this.validateEndTime })
  }

  get scheduleData() { return this.scheduleForm.get('items') as FormArray; }

  timeData(index: number) {
    return this.scheduleData.controls[index].get('times') as FormArray;
  }

  addItem(day): void {
    this.items = this.scheduleForm.get('items') as FormArray;
    this.items.push(this.createItem(day));
  }

  removeItem(index: number): void {
    this.items = this.scheduleForm.get('items') as FormArray;
    this.items.removeAt(index);
  }

  addTimeslot(index: number): void {
    this.items = this.scheduleForm.get('items') as FormArray;
    // should add to the correct day via retrieving an index number
    let test = this.items.controls[index] as FormGroup;
    this.times = test.controls.times as FormArray;
    this.times.push(this.createTimes());
  }

  validateEndTime(AC: AbstractControl)  {
    console.log(AC);
    const start = AC.get('startTime').value;
    const end = AC.get('endTime').value;
    console.log(start, end);

    // each interval must not be more than 4 hours
    let validDuration = Math.abs(end - start) <= 4 ? true : false;

    return start !== null && end !== null && start < end && validDuration
      ? null
      : { range: true };
  }

  // for primeng button
  handleChange(value) {
    const isValueSelected = this.selectedDays.includes(value);
    const index = this.scheduleForm.controls.items.value.findIndex(val => val.day == value);

    isValueSelected ? this.addItem(value) : this.removeItem(index);
  }

  submit() {
    let totalHours = 0;
    let totalHoursValid = false;
    let intervalCheck = true; // valid interval default. should also ensure overlap
    // let noOverlapCheck = true; // no overlaps default. will be false if overlap detected

    // need to check for total hours in WWS

    this.scheduleForm.value.items.forEach(item => {

      // do not count items with the same startTime and endTime
      let times = new Map();

      for (var i = 0; i < item.times.length; i++) {
        if (times.get(item.times[i].startTime) == null) {
          times.set(item.times[i].startTime, item.times[i].startTime);
          totalHours += item.times[i].endTime - item.times[i].startTime;
          console.log('totalHours', totalHours);
        }

        // depends on length of item.times,
        // if len == 1, then is valid
        // if len > 1, do a check between start time of curr item, vs end time of prev item
        if (i >= 1) {
          intervalCheck = item.times[i].startTime - item.times[i - 1].endTime >= 1 ? true : false;
          // noOverlapCheck = item.times[i - 1].startTime < item.times[i].endTime && item.times[i - 1].endTime > item.times[i].startTime;
        }
      }
    });

    totalHoursValid = totalHours >= 10 && totalHours <= 48;

    console.log(totalHours);
    console.log(intervalCheck);
    // console.log('overlap', noOverlapCheck);

    // need to check for at least one hr between intervals
    console.log(this.scheduleForm);

    if (!totalHoursValid) {
      this.totalHourError = true;
    }

    if (!intervalCheck) {
      this.intervalError = true;
    }

    // is valid or not valid
    return totalHoursValid  && intervalCheck ? true : false;
  }
}
