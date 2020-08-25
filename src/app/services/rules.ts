import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EntityService } from "./entity";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class RulesService extends EntityService {
  
  
  constructor(public http: HttpClient) {
    super(http)
    this.parameter = "rules"
  }

  getBySupplier(id:String) {
    return this.http.get(environment.serverUrl+this.parameter+"/bySupplier/"+id);
  }

  testRules(rules,exampleData){
    return this.http.post(environment.serverUrl+this.parameter+"/testRules",{ rules, exampleData });
  }

}