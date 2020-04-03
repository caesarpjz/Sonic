import { FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

interface City {
  name: string;
  code: string;
}

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
  ]
  timeOptions: any;

  startTime: any;
  endTime: any;

  scheduleForm: FormGroup;
  items: FormArray;
  times: FormArray;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.scheduleForm = this.formBuilder.group({
      items: this.formBuilder.array([ this.createItem() ])
    })
  }

  // creates days containing an array of time slots
  createItem(): FormGroup {
    return this.formBuilder.group({
      day: 'monday',
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

  addItem(): void {
    this.items = this.scheduleForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  addTimeslot(): void {
    this.items = this.scheduleForm.get('items') as FormArray;
    let test = this.items.controls[0] as FormGroup;
    this.times = test.controls.times as FormArray;
    this.times.push(this.createTimes());
  }

  validateEndTime(AC: AbstractControl)  {
    console.log(AC);
    const start = AC.get('startTime').value;
    const end = AC.get('endTime').value;
    console.log(start, end);
    return start !== null && end !== null && start < end
      ? null
      : { range: true };
  }

  submit() {
  }
}
