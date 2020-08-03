import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Store, select } from "@ngrx/store";
import { selectToken } from "../store/selectors/auth";
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  token$ =  this.store.pipe(select(selectToken));

  constructor( private store: Store<any>, public router: Router,
    public jwtHelper: JwtHelperService) {}
  canActivate(): any {
    
    const token = this.checkToken()

    if (!token) {
      this.router.navigate(['login']);
      return false;
    }
    else{
      return true
    }
    
  }

  async checkToken(){
    const token = await this.token$.toPromise() 
    return !this.jwtHelper.isTokenExpired(token);
  }
}
