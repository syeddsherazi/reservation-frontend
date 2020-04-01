import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-reservations-list',
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.css']
})
export class ReservationsListComponent {
  @Input() reservations; // RESERVATIONS LIST
  @Input() months; // MONTHS LIST
  @Output() cancelReservation: EventEmitter<any> = new EventEmitter(); // ON CANCEL RESERVATION

  constructor() {}

  getDateToDisplay(unix) {
    return moment.unix(unix).format('Do, ddd');
  }
}
