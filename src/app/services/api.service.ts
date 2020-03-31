import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private _baseEndPoint = 'http://localhost:3000'; // Ideally will be in .env file

  constructor(private http: HttpClient) {}

  // GET SERVER TIME
  getServerTime() {
    return this.http.get(`${this._baseEndPoint}/now`);
  }

  // GET RESERVATIONS FOR TIME INTERVAL
  getReservations(startTime, endTime) {
    return this.http.get(
      `${this._baseEndPoint}/reserve/${startTime}/${endTime}`
    );
  }
}
