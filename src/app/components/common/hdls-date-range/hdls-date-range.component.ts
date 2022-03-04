import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-hdls-date-range',
  templateUrl: './hdls-date-range.component.html',
  styleUrls: ['./hdls-date-range.component.scss']
})
export class HdlsDateRangeComponent implements OnInit {

  date: any = {
    start: '',
    end: '',
  };

  minDate: Date;
  maxDate: Date;
  @Output()
  getDateRange = new EventEmitter();
  constructor() {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  ngOnInit(): void {}

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.date[type] = moment(event.value).format('YYYY-MM-DD');
  }

  sendDetails() {
    this.getDateRange.emit(this.date);
  }
}

