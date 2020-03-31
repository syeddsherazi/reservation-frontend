import { Component, OnInit } from '@angular/core';
import { ApiService } from './services';
import * as moment from 'moment';
import * as momentTimeZone from 'moment-timezone';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currMonth;
  currYear;
  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  years = [];
  selectedDate;
  myTime = new Date();
  reservations = [];
  isLoading = false;
  isLoadingServerTime = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.generateYears();
    this.getServerTime();
    console.log('my timezone is ', momentTimeZone.tz.guess());
  }

  getServerTime() {
    this.apiService.getServerTime().subscribe(
      data => {
        // console.log(
        //   'time is ',
        //   data,
        //   'my time is ',
        //   Math.floor(this.myTime.getTime() / 1000),
        //   this.myTime
        // );
        this.myTime = new Date(data.time);
        this.isLoadingServerTime = false;
        console.log('client time now is ', new Date(data.time));
        this.currMonth = this.myTime.getMonth();
        this.currYear = this.myTime.getFullYear();
        console.log('client month and year is ', this.currMonth, this.currYear);
        this.getReservations();
      },
      err => console.error(err),
      () => console.log('done loading foods')
    );
  }

  generateYears() {
    this.currYear = new Date().getFullYear();
    for (let i = this.currYear - 20; i <= this.currYear + 20; i++) {
      this.years.push(i);
    }
  }

  next() {
    this.currYear = this.currMonth === 11 ? this.currYear + 1 : this.currYear;
    this.currMonth = (this.currMonth + 1) % 12;
    this.getReservations();
  }

  previous() {
    this.currYear = this.currMonth === 0 ? this.currYear - 1 : this.currYear;
    this.currMonth = this.currMonth === 0 ? 11 : this.currMonth - 1;
    this.getReservations();
  }

  onMonthChange(newMonth) {
    this.currMonth = newMonth;
    console.log('new month is ', newMonth);
    this.getReservations();
  }

  onYearChange(newYear) {
    this.currYear = newYear;
    console.log('new year is ', newYear);
    this.getReservations();
  }

  daySelected(day) {
    console.log('day selected', day, this.currYear, this.currMonth);
    var d = new Date(this.currYear, this.currMonth, day.date);
    console.log('selected day will be', d);
    var unixTimeStamp = Math.floor(d.getTime() / 1000);
    console.log('unix timestamp is ', unixTimeStamp);
  }

  getReservations() {
    let tempDate = new Date(this.currYear, this.currMonth, 1);
    let startTime = moment(tempDate);
    let endTime = startTime.clone().endOf('month');
    console.log(
      'start time is ',
      startTime.toDate(),
      'end time is ',
      endTime.toDate()
    );
    this.isLoading = true;
    this.apiService.getReservations(startTime.unix(), endTime.unix()).subscribe(
      data => {
        this.reservations = data['reserved'];
        console.log('reservations are ', data);
      },
      err => console.error(err),
      () => {
        console.log('done loading foods');
        this.isLoading = false;
      }
    );
  }

  getDateToDisplay(unix) {
    return moment.unix(unix).format('Do, ddd');
  }
}
