import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MonthSelectorComponent } from './month-selector/month-selector.component';
import { ApiService } from './services'; // our custom service, see below
import { MakeReservationComponent } from './make-reservation/make-reservation.component';
import { CancelReservationComponent } from './cancel-reservation/cancel-reservation.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    MonthSelectorComponent,
    MakeReservationComponent,
    CancelReservationComponent
  ],
  entryComponents: [MakeReservationComponent, CancelReservationComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    SimpleNotificationsModule.forRoot()
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule {}
