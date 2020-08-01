import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EntityService } from "./entity";


@Injectable({
  providedIn: "root"
})
export class UsersService extends EntityService {
  
  
  constructor(public http: HttpClient) {
    super(http)
    this.parameter = "users"
  }

}