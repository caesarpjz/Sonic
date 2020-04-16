import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-view-schedule',
  templateUrl: './view-schedule.component.html',
  styleUrls: ['./view-schedule.component.css']
})
export class ViewScheduleComponent implements OnInit {
  events: any[];

  options: any;

  constructor() { }

  ngOnInit(): void {
    // this.eventService.getEvents().then(events => { this.events = events; });

    this.events = [
        {
          "id": 1,
          "title": "All Day Event",
          "start": "2017-02-01"
        },
        {
          "id": 2,
          "title": "Long Event",
          "start": "2017-02-07",
          "end": "2017-02-10"
        },
        {
          "id": 3,
          "title": "Repeating Event",
          "start": "2017-02-09T16:00:00"
        }
      ];

    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      defaultDate: '2017-02-01',
      header: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }
    };
  }

}
