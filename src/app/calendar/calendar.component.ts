import { Component, OnChanges } from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnChanges {
  @Input() currMonth; // SELECTED MONTH
  @Input() currYear; // SELECTED YEAR
  @Input() reservations; // RESERVATIONS LIST
  @Output() daySelected: EventEmitter<any> = new EventEmitter(); // EMIT ON CELL CLICK
  weeks = [];

  constructor() {}

  ngOnChanges() {
    this.generateCalendar(this.currYear, this.currMonth);
  }

  getPreviousDates() {
    // GET DATES OF PREV MONTH TO DISPLAY
    return (
      32 -
      new Date(
        this.currMonth === 0 ? this.currYear - 1 : this.currYear,
        this.currMonth === 0 ? 11 : this.currMonth - 1,
        32
      ).getDate()
    );
  }

  daysInMonth(iMonth, iYear) {
    // CHECK NO OF DAYS IN MONTH
    return 32 - new Date(iYear, iMonth, 32).getDate();
  }

  generateCalendar(year, month) {
    // GENERATE CALENDAR

    this.weeks = [];
    let prevDates = this.getPreviousDates(); // GET PREV MONTH DATES TO DISPLAY
    let firstDay = new Date(year, month).getDay();
    let date = 1;

    // CAN HAVE MAX OF 6 ROWS FOR WEEKS
    for (let i = 0; i < 6; i++) {
      let row = [];

      // CREATE INDIVIDUAL DATES
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          // IF DATES OF PREV MONTH
          row.push({
            date: prevDates - (firstDay - 1),
            reserved: false,
            included: false
          });
          prevDates++;
        } else if (date > this.daysInMonth(month, year)) {
          // IF EXCEED NO OF DAYS WITHIN MONTH
          break;
        } else {
          // PUSH DATES OF MONTH
          row.push({
            date,
            reserved: false,
            included: true,
            unix: moment(new Date(year, month, date)).unix()
          });
          date++;
        }
      }

      // PUSH ENTIRE WEEK IN 2D ARRAY
      this.weeks.push(row);
    }

    if (!this.weeks[this.weeks.length - 1].length) {
      // IF LAST WEEK I.E. WEEK 6 HAS NO DATE, THEN POP ARRAY
      this.weeks.pop();
    }

    let remainingDays = 0;
    while (this.weeks[this.weeks.length - 1].length < 7) {
      // PUSH ANY REMAINING DAYS OF NEXT MONTH FOR DISPLAY PURPOSE ONLY
      remainingDays++;
      this.weeks[this.weeks.length - 1].push({
        date: remainingDays,
        reserved: false,
        included: false
      });
    }

    // SET RESERVED CELLS BASED UPON RECIEVED ARRAY
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
              // IF DAY INCLUDED IN CURRENT MONTH, AND RESERVATION IS OF SAME DAY, RESERVE IT
              day.reserved = true;
              day.tennantName = reservation.tennantName;
              day.unix = reservation.time;
            }
          }
        }
      }
    }
  }
}
