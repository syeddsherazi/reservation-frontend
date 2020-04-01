import { Component, OnInit } from '@angular/core';
import { ApiService } from './services';
import { MakeReservationComponent } from './make-reservation';
import { CancelReservationComponent } from './cancel-reservation';
import { MONTHS_LIST } from './constants';
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
  months = MONTHS_LIST;
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

  onListCancel(item) {
    // ON CANCEL CALL FROM RESERVATION LIST
    this.cancelReservation(item.time, item.tennantName);
  }

  daySelected(day) {
    // CONVERT DATE INTO SERVER TIMEZONE
    let tempDate = momentTimeZone
      .tz([this.currYear, this.currMonth, day.date], this.serverTimeZone)
      .endOf('day');

    // IF ALREADY RESERVED CANCEL RESERVATION, ELSE MAKE ONE
    if (!day.reserved) {
      this.makeReservation(tempDate.unix(), tempDate.format('ddd, Do MMMM'));
    } else {
      this.cancelReservation(day.unix, day.tennantName);
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

          // SORTING TO SHOW ORDERED LIST IN RESERVATIONS LIST SECTION
          this.reservations = this.reservations.sort(function(x, y) {
            return x.time - y.time;
          });

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
              this.getReservations();
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

  cancelReservation(unixDate, tennantName) {
    // CANCEL RESERVATION, CALLING DIALOG COMPONENT
    let dateString = moment.unix(unixDate).format('Do, ddd');
    let dialogRef = this.dialog.open(CancelReservationComponent, {
      data: {
        dateString,
        tennantName
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
            reserved: false
          })
          .subscribe(
            data => {
              this.notificationsService.success(
                'Reservation Cancelled Successfully',
                '',
                {
                  timeOut: 3000,
                  showProgressBar: true,
                  clickToClose: true
                }
              );
              this.getReservations();
            },
            err => {
              this.getReservations();
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
