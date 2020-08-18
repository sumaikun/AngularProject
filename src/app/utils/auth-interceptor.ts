import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store, select } from "@ngrx/store";
import { selectToken } from '../store/selectors/auth';

import { mergeMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

token$ =  this.store.pipe(select(selectToken));

constructor(private store: Store<any>){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if(req.url.includes("auth"))
        {
            //console.log("include auth")

            return next.handle(req);
        }


        return this.token$.pipe(
            mergeMap((token: string) => {
                //console.log("token",token)
                if (!token) {
                    return next.handle(req);
                }
                const headers = req.clone({
                    headers: req.headers.set('Authorization', `Bearer ${token}`)
                });
                return next.handle(headers);
            }
        ))          
       
    }

 
}