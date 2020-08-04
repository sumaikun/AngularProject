import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopifyService {

  constructor(public http: HttpClient) { }

  getProducts():any{
    return this.http.get(environment.serverUrl+"auth/test")
  }

}
