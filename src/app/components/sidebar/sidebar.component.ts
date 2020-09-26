import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { selectUser } from 'src/app/store/selectors/auth';
import { environment } from '../../../environments/environment'

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/users', title: 'Usuarios',  icon:'ni-single-02 text-yellow', class: '' },
    { path: '/suppliers', title: 'Proveedores',  icon:'ni-pin-3 text-orange', class: '' },
    { path: '/products', title: 'Catalogos',  icon:'ni-cart text-pink', class: '' },
    { path: '/rules', title: 'Reglas',  icon:'ni-planet text-blue', class: '' },
    { path: '/chronos', title: 'Crónograma',  icon:'ni-bullet-list-67 text-info', class: '' },
    { path: '/productUpdated', title: 'Actualizaciones',  icon:'ni-bullet-list-67 text-danger', class: '' },
    /*{ path: '/icons', title: 'Icons',  icon:'ni-planet text-blue', class: '' },
    { path: '/maps', title: 'Maps',  icon:'ni-pin-3 text-orange', class: '' },
    { path: '/user-profile', title: 'User profile',  icon:'ni-single-02 text-yellow', class: '' },
    { path: '/tables', title: 'Tables',  icon:'ni-bullet-list-67 text-red', class: '' },
    { path: '/login', title: 'Login',  icon:'ni-key-25 text-info', class: '' },
    { path: '/register', title: 'Register',  icon:'ni-circle-08 text-pink', class: '' }*/
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  @Output() collapseMenu = new EventEmitter<boolean>();

  //this.idsSelectedEvent.emit(this.idsChecked)

  isCollapse:boolean

  user$ =  this.store.pipe(select(selectUser));

  userPicture:string

  constructor(private router: Router, private store: Store<any>) { }

  ngOnInit() {

    this.isCollapse = false

    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });

    this.userPicture = environment.defaultImage

    this.user$.subscribe( user => {
      if(user.photoUrl)
      {
        this.userPicture = environment.imagesUrl+user.photoUrl
      }
    })
   
  }

  closeMenu(){
    console.log("close menu")
    this.isCollapse = !this.isCollapse
    return this.collapseMenu.emit(this.isCollapse) 
  }
}
