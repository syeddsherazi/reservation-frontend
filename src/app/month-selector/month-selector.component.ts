import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-month-selector',
  templateUrl: './month-selector.component.html',
  styleUrls: ['./month-selector.component.css']
})
export class MonthSelectorComponent implements OnInit {
  @Input() months;
  @Input() currMonth;
  @Input() years;
  @Input() currYear;
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() previous: EventEmitter<any> = new EventEmitter();
  @Output() onMonthChange: EventEmitter<any> = new EventEmitter();
  @Output() onYearChange: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {
    console.log('init curr month is ', this.currMonth);
  }
}
