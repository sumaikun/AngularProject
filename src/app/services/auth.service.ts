import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public http: HttpClient) { }

  authenticate(username,password){
    return this.http.post<any>(environment.serverUrl+"auth",{
      email:username,
      password
    })
  }
}
