import { ScheduleService } from './../services/schedule.service';
import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import * as moment from 'moment';

@Component({
  selector: 'app-view-schedule',
  templateUrl: './view-schedule.component.html',
  styleUrls: ['./view-schedule.component.css']
})
export class ViewScheduleComponent implements OnInit {
  events = [];

  options: any;

  constructor(private scheduleService: ScheduleService) { }

  ngOnInit(): void {
    this.getSchedule();

    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      defaultDate: '2020-05-08',
      header: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }
    };
  }

  getSchedule() {
    this.scheduleService.getSchedule().subscribe((res) => {
      const schedule = res;
      // transform data
      schedule.map((shift) => {
        let transformedShift = {
          'id': shift.shift_id,
          'title': 'Shift',
          'start': moment.parseZone(shift.start_time).local().format(),
          'end': moment.parseZone(shift.end_time).local().format()
        }

        this.events.push(transformedShift);
      });
    });
  }

}
