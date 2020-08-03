import { Routes , CanActivate } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { UsersComponent } from '../../pages/users/users.component'
import { UserFormComponent } from '../../pages/user-form/user-form.component'

//Resolvers
import { UsersResolver } from "../../resolvers/users.resolver";

//Guards
import { AuthGuardService as AuthGuard } from "../../services/auth-guard.service"

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
        canActivate: [AuthGuard]  
    },
    { path: 'user-form',       component:UserFormComponent,
        resolve:{ 
            entities:UsersResolver
        },
        canActivate: [AuthGuard]  
    },
    { path: 'user-form/:mode',       component:UserFormComponent,
        resolve:{ 
            entities:UsersResolver
        },
        canActivate: [AuthGuard]    
    },
    { path: 'user-form/:mode/:id',       component:UserFormComponent,
        resolve:{ 
            entities:UsersResolver
        },
        canActivate: [AuthGuard]    
    }
];
