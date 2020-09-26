import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class ProductTraceService {
  
  private parameter:string
  
  constructor(public http: HttpClient) {
    this.parameter = "productTrace"
  }

  findBetweenDates(fromDate:String,toDate:String) {
    return this.http.get(environment.serverUrl+this.parameter+"/"+fromDate+"/"+toDate);
  }

}
