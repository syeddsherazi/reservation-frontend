import { Component, OnInit, OnChanges } from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @Input() currMonth;
  @Input() currYear;
  @Input() reservations;
  @Output() daySelected: EventEmitter<any> = new EventEmitter();
  weeks = [];

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    this.generateCalendar(this.currYear, this.currMonth);
  }

  getPreviousDates() {
    return (
      32 -
      new Date(
        this.currMonth === 0 ? this.currYear - 1 : this.currYear,
        this.currMonth === 0 ? 11 : this.currMonth - 1,
        32
      ).getDate()
    );
  }
  // check how many days in a month code from https://dzone.com/articles/determining-number-days-month
  daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  }

  generateCalendar(year, month) {
    this.weeks = [];
    let prevDates = this.getPreviousDates();

    let firstDay = new Date(year, month).getDay();
    console.log('first day is ', firstDay);
    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
      let row = [];

      //creating individual cells, filing them up with data.
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          row.push({
            date: prevDates - (firstDay - 1),
            reserved: false,
            included: false
          });
          prevDates++;
        } else if (date > this.daysInMonth(month, year)) {
          break;
        } else {
          row.push({
            date,
            reserved: false,
            included: true,
            unix: moment(new Date(year, month, date)).unix()
          });
          date++;
        }
      }

      this.weeks.push(row);
    }

    if (!this.weeks[this.weeks.length - 1].length) {
      this.weeks.pop();
    }

    let remainingDays = 0;
    while (this.weeks[this.weeks.length - 1].length < 7) {
      remainingDays++;
      this.weeks[this.weeks.length - 1].push({
        date: remainingDays,
        reserved: false,
        included: false
      });
    }
    this.setReservations();
  }

  setReservations() {
    if (this.reservations && this.reservations.length) {
      for (let reservation of this.reservations) {
        for (let week of this.weeks) {
          for (let day of week) {
            if (
              day.included &&
              moment.unix(day.unix).isSame(moment.unix(reservation.time), 'day')
            ) {
              day.reserved = true;
              day.tennantName = reservation.tennantName;
              console.log(
                moment.unix(day.unix).toDate(),
                ' and ',
                moment.unix(reservation.time).toDate(),
                'are on same day',
                moment
                  .unix(day.unix)
                  .isSame(moment.unix(reservation.time), 'day')
              );
            }
            moment.unix(day.unix).isSame(moment.unix(reservation.time), 'day');
          }
        }
      }
    }
  }
}
