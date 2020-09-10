import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopifyService {

  constructor(public http: HttpClient) { }

  getProducts():any{
    return this.http.get(environment.serverUrl+"shopify/allProducts")
  }

  getByVendor(vendor:String):any{
    return this.http.get(environment.serverUrl+"shopify/byVendor/"+vendor)
  }

  getCountByVendor(vendor:String):any{
    return this.http.get(environment.serverUrl+"shopify/countByVendor/"+vendor)
  }

  getByVendorDirection(vendor:String,lastID:String,direction:String):any{
    return this.http.get(environment.serverUrl+"shopify/byVendorDirection/"+vendor+"/"+lastID+"/"+direction)
  }

}
