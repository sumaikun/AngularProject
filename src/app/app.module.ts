import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

//store

import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { StoreModule, MetaReducer, ActionReducer } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreRouterConnectingModule } from "@ngrx/router-store";

import { appEffects, REDUCER_TOKEN } from "./store";
import { environment } from "../environments/environment";

//modules

import { SearchService } from "./services/search.service"
import { FilesService } from "./services/files.service"
import { AuthInterceptor } from './utils/auth-interceptor';
import { JwtHelperService, JWT_OPTIONS  } from '@auth0/angular-jwt';


import { localStorageSync } from 'ngrx-store-localstorage';


export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: ['auth']})(reducer);
}
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];
 

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
     // Store modules
     StoreModule.forRoot(REDUCER_TOKEN,
      {metaReducers}),
     StoreRouterConnectingModule.forRoot(),
     ...(environment.production
       ? []
       : [
           StoreDevtoolsModule.instrument({
             name: "CRUD Application",
             logOnly: environment.production
           })
         ]),
     EffectsModule.forRoot([...appEffects]),
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
  ],
  exports: [
    ComponentsModule
  ],
  providers: [ SearchService,FilesService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
