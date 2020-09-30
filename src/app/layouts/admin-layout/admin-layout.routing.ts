import { Routes , CanActivate } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { UsersComponent } from '../../pages/users/users.component'
import { UserFormComponent } from '../../pages/user-form/user-form.component'
import { SuppliersComponent } from '../../pages/suppliers/suppliers.component'
import { SuppliersFormComponent } from '../../pages/suppliers-form/suppliers-form.component'
import { RulesComponent } from '../../pages/rules/rules.component'
import { ChronosComponent } from '../../pages/chronos/chronos.component'
import { ProductsUpdatesComponent } from '../../pages/productsUpdated/productsUpdated.component'
import { ProductsComponent } from 'src/app/pages/products/products.component';
//Resolvers
import { UsersResolver } from "../../resolvers/users.resolver";
import { SuppliersResolver } from "../../resolvers/suppliers.resolver";

//Guards
import { AuthGuardService as AuthGuard } from "../../services/auth-guard.service"
import { AdminGuardService as AdminGuard } from "../../services/admin-guard.service"


export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent,
        canActivate: [AuthGuard]  
    },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'users',          component: UsersComponent,
        resolve:{ 
            entities:UsersResolver
        },
        canActivate: [AuthGuard,AdminGuard]  
    },
    { path: 'user-form',       component:UserFormComponent,
        resolve:{ 
            entities:UsersResolver
        },
        canActivate: [AuthGuard,AdminGuard]  
    },
    { path: 'user-form/:mode',       component:UserFormComponent,
        resolve:{ 
            entities:UsersResolver
        },
        canActivate: [AuthGuard,AdminGuard]    
    },
    { path: 'user-form/:mode/:id',       component:UserFormComponent,
        resolve:{ 
            entities:UsersResolver
        },
        canActivate: [AuthGuard,AdminGuard]    
    },
    { path: 'suppliers',          component: SuppliersComponent,
        resolve:{ 
            entities:SuppliersResolver
        },
        canActivate: [AuthGuard,AdminGuard]  
    },
    { path: 'supplier-form',       component:SuppliersFormComponent,
        resolve:{ 
            entities:SuppliersResolver
        },
        canActivate: [AuthGuard,AdminGuard]  
    },
    { path: 'supplier-form/:mode',       component:SuppliersFormComponent,
        resolve:{ 
            entities:SuppliersResolver
        },
        canActivate: [AuthGuard,AdminGuard]    
    },
    { path: 'supplier-form/:mode/:id',       component:SuppliersFormComponent,
        resolve:{ 
            entities:SuppliersResolver
        },
        canActivate: [AuthGuard,AdminGuard]    
    },
    { path: 'products',          component: ProductsComponent,
        
        canActivate: [AuthGuard]  
    },
    { path: 'rules',          component: RulesComponent,
        
        canActivate: [AuthGuard]  
    },
    { path: 'chronos',          component: ChronosComponent,
        
        canActivate: [AuthGuard]  
    },
    { path: 'productUpdated',   component: ProductsUpdatesComponent,
        canActivate: [AuthGuard]  
    }
];
