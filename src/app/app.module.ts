import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

//store

import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreRouterConnectingModule } from "@ngrx/router-store";

import { appEffects, REDUCER_TOKEN } from "./store";
import { environment } from "../environments/environment";

//modules

import { DemoNumber } from "../app/utils/demoNumber"

import { SearchService } from "./services/search.service"

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
     StoreModule.forRoot(REDUCER_TOKEN),
     StoreRouterConnectingModule.forRoot(),
     ...(environment.production
       ? []
       : [
           StoreDevtoolsModule.instrument({
             name: "CRUD Application",
             logOnly: environment.production
           })
         ]),
     EffectsModule.forRoot([...appEffects])
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
  ],
  providers: [ SearchService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
