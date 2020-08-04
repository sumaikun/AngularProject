import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Store, select } from "@ngrx/store";
import { selectToken } from "../store/selectors/auth";
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  token$ =  this.store.pipe(select(selectToken));

  constructor( private store: Store<any>, public router: Router,
    public jwtHelper: JwtHelperService) {}
    canActivate(): Observable<boolean>|boolean  {
 
      return this.token$.pipe(
        map((token: string) => {
            //console.log("token",token)
            //console.log(this.jwtHelper.isTokenExpired(token))
            if (!token) {
              this.router.navigate(['login']);
              return false;
            }
            else{
              
              if(this.jwtHelper.isTokenExpired(token))
              {
                this.router.navigate(['login']);
                return false;
              }
              else{
                return true;
              }
              
            }
        }
    )) 
  }

  /*async checkToken(){
    const token = await this.token$.toPromise() 
    return !this.jwtHelper.isTokenExpired(token)
  }*/
}
