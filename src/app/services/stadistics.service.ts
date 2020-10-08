import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class StadisticsService {

  constructor(public http: HttpClient) { }

  getStadistics():any{
    return this.http.get(environment.serverUrl+"stadistics")
  }
}