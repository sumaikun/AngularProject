import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { UsersComponent } from '../../pages/users/users.component';
import { UserFormComponent } from '../../pages/user-form/user-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { ToastrModule } from 'ngx-toastr';
import { UsersResolver } from "../../resolvers/users.resolver";
import { DemoNumber } from "../../utils/demoNumber"
import { TableFooterComponent } from "../../components/table-footer/table-footer.component"
import { PictureModalComponent } from "../../components/picture-modal/picture-modal.component" 
import { SuppliersComponent } from "../../pages/suppliers/suppliers.component"
import { SuppliersResolver } from "../../resolvers/suppliers.resolver";
import { SuppliersFormComponent } from 'src/app/pages/suppliers-form/suppliers-form.component';
import { SelectTableComponent } from "../../components/select-table/select-table.component"
import { ProductsComponent } from 'src/app/pages/products/products.component';
import { RulesComponent } from 'src/app/pages/rules/rules.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChronosComponent } from '../../pages/chronos/chronos.component'
import { ChronosFormComponent } from '../../pages/chronos-form/chronos-form.component'

@NgModule({
  imports: [
    NgSelectModule,
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule
  ],
  declarations: [
    DemoNumber,
    DashboardComponent,
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    UsersComponent,
    UserFormComponent,
    PictureModalComponent,
    SuppliersComponent,
    SuppliersFormComponent,
    SelectTableComponent,
    ProductsComponent,
    RulesComponent,
    ChronosComponent,
    ChronosFormComponent,
    TableFooterComponent,  
  ],
  providers: [
    UsersResolver,
    SuppliersResolver
  ]
})

export class AdminLayoutModule {}
