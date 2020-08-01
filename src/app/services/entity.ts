import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class EntityService {
  
  
  protected parameter:String

  constructor(public http: HttpClient) {
  }  

  getEntities() {
    return this.http.get(environment.serverUrl+this.parameter);
  }

  saveEntity(data) {
    return this.http.post(environment.serverUrl+this.parameter,data);
  }

  getEntity(id) {
    return this.http.get(environment.serverUrl+this.parameter+"/"+id);
  }

  deleteEntity(id) {
    return this.http.delete(environment.serverUrl+this.parameter+"/"+id);
  }

  updateEntity(data,id) {
    return this.http.put(environment.serverUrl+this.parameter+"/"+id,data);
  }


}