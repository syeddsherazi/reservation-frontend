import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private _baseEndPoint = 'http://localhost:3000'; // Ideally will be in .env file

  constructor(private http: HttpClient) {}

  // GET SERVER TIME
  getServerTime(): Observable<any> {
    return this.http.get(`${this._baseEndPoint}/now`);
  }

  // GET RESERVATIONS FOR TIME INTERVAL
  getReservations(startTime, endTime): Observable<any> {
    return this.http.get(
      `${this._baseEndPoint}/reserve/${startTime}/${endTime}`
    );
  }

  // MODIFY RESERVATIONS FOR SOME DATE
  modifyReservation(body): Observable<any> {
    return this.http.post(`${this._baseEndPoint}/reserve`, body);
  }
}
