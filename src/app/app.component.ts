import { Component, OnInit } from '@angular/core';
import { ApiService } from './services';
import { MakeReservationComponent } from './make-reservation';
import * as moment from 'moment';
import * as momentTimeZone from 'moment-timezone';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currMonth;
  currYear;
  months = [
    // MOVE TO CONSTS
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
  serverTime; // SERVER TIME, FOR GENERATING CALENDAR
  serverTimeZone; // SERVER TIMEZONE , NEEDED TO SEND TIMESTAMP WHILE RESERVATION
  reservations = [];
  isLoading = false; // FOR API HITS IN PROGRESS
  isLoadingServerTime = true; // FOR LOADING SERVER TIME

  constructor(
    private _apiService: ApiService,
    public dialog: MatDialog,
    public notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    this.generateYears();
    this.getServerTime();
  }

  getServerTime() {
    this._apiService.getServerTime().subscribe(
      data => {
        // GENERATE CLIENT CALENDAR BASED ON SERVER TIME
        // NO NEED TO GENERATE IN SAME TIMEZONE, AS TIMEZONE CONVERTED WHILE POST REQUESTS
        this.serverTime = new Date(data.time);
        this.serverTimeZone = data.timeZone;
        this.isLoadingServerTime = false;
        this.currMonth = this.serverTime.getMonth();
        this.currYear = this.serverTime.getFullYear();
        this.getReservations();
      },
      err => {
        this.notificationsService.error('Something bad occured', '', {
          timeOut: 3000,
          showProgressBar: true,
          clickToClose: true
        });
      }
    );
  }

  generateYears() {
    // CURRENTLY GENERATING CALENDAR FOR ONLY 40 YEARS i.e. +-20 CURRENT YEAR
    this.currYear = new Date().getFullYear();
    for (let i = this.currYear - 20; i <= this.currYear + 20; i++) {
      this.years.push(i);
    }
  }

  next() {
    // GET NEXT MONTH
    this.currYear = this.currMonth === 11 ? this.currYear + 1 : this.currYear;
    this.currMonth = (this.currMonth + 1) % 12;
    this.getReservations();
  }

  previous() {
    // GET PREV MONTH
    this.currYear = this.currMonth === 0 ? this.currYear - 1 : this.currYear;
    this.currMonth = this.currMonth === 0 ? 11 : this.currMonth - 1;
    this.getReservations();
  }

  onMonthChange(newMonth) {
    // ON MONTH CHANGE FROM DROPDOWN
    this.currMonth = newMonth;
    this.getReservations();
  }

  onYearChange(newYear) {
    // ON YEAR CHANGE FROM DROPDOWN
    this.currYear = newYear;
    this.getReservations();
  }

  daySelected(day) {
    // CONVERT DATE INTO SERVER TIMEZONE
    let tempDate = momentTimeZone
      .tz([this.currYear, this.currMonth, day.date], this.serverTimeZone)
      .endOf('day');

    // IF ALREADY RESERVED CANCEL RESERVATION, ELSE MAKE ONE
    if (day.reserved || !day.reserved) {
      this.makeReservation(tempDate.unix(), tempDate.format('ddd, Do MMMM'));
    }
  }

  getReservations() {
    // GET RESERVATIONS FOR MONTH
    let tempDate = new Date(this.currYear, this.currMonth, 1);
    let startTime = moment(tempDate);
    let endTime = startTime.clone().endOf('month');

    this.isLoading = true;
    this._apiService
      .getReservations(startTime.unix(), endTime.unix())
      .subscribe(
        data => {
          this.reservations = data['reserved'];
          this.isLoading = false;
        },
        err => {
          this.notificationsService.error('Something bad occured', '', {
            timeOut: 3000,
            showProgressBar: true,
            clickToClose: true
          });
          this.isLoading = false;
        }
      );
  }

  getDateToDisplay(unix) {
    return moment.unix(unix).format('Do, ddd');
  }

  makeReservation(unixDate, dateString) {
    // MAKE RESERVATION, CALLING DIALOG COMPONENT
    let dialogRef = this.dialog.open(MakeReservationComponent, {
      data: {
        dateString
      },
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this._apiService
          .modifyReservation({
            tennantName: result,
            time: unixDate,
            reserved: true
          })
          .subscribe(
            data => {
              this.notificationsService.success('Reservation successsful', '', {
                timeOut: 3000,
                showProgressBar: true,
                clickToClose: true
              });
              this.getReservations();
            },
            err => {
              if (err.error) {
                this.notificationsService.error(err.error, '', {
                  timeOut: 3000,
                  showProgressBar: true,
                  clickToClose: true
                });
              } else {
                this.notificationsService.error('Something bad occured', '', {
                  timeOut: 3000,
                  showProgressBar: true,
                  clickToClose: true
                });
              }
            }
          );
      }
    });
  }
}
