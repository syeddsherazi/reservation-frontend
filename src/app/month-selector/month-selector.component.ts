import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-month-selector',
  templateUrl: './month-selector.component.html',
  styleUrls: ['./month-selector.component.css']
})
export class MonthSelectorComponent {
  @Input() months; // LIST OF MONTHS
  @Input() currMonth; // SELECTED MONTH
  @Input() years; // LIST OF YEARS
  @Input() currYear; // SELECTED YEAR
  @Output() next: EventEmitter<any> = new EventEmitter(); // EMIT ON NEXT MONTH
  @Output() previous: EventEmitter<any> = new EventEmitter(); // EMIT ON PREV MONTH
  @Output() onMonthChange: EventEmitter<any> = new EventEmitter(); // ON MONTH CHANGE FROM DROPDOWN
  @Output() onYearChange: EventEmitter<any> = new EventEmitter(); // ON YEAR CHANGE FROM DROPDOWN

  constructor() {}
}
