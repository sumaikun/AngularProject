import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Store, select } from "@ngrx/store";
import { selectRole } from "../store/selectors/auth";
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  role$ =  this.store.pipe(select(selectRole));

  constructor( private store: Store<any>, public router: Router,
    public jwtHelper: JwtHelperService) {}
    canActivate(): Observable<boolean>|boolean  {
 
      return this.role$.pipe(
        map((role: string) => {
            if (role != "ADMIN") {
              this.router.navigate(['login']);
              return false;
            }
            return true
            
        }
    )) 
  }

  /*async checkToken(){
    const token = await this.token$.toPromise() 
    return !this.jwtHelper.isTokenExpired(token)
  }*/
}
