import { Component, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service'
import { Store, select } from '@ngrx/store';
import { selectUser } from 'src/app/store/selectors/auth';
import { environment } from '../../../environments/environment'
import { AuthActions } from '../../store/actions'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;

  textTosearch:string

  userName:string

  user$ =  this.store.pipe(select(selectUser));

  userPicture:string

 

  constructor(location: Location,
      private element: ElementRef,
      private router: Router,
      private searchService: SearchService,
      private store: Store<any>) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.userPicture = environment.defaultImage

    this.user$.subscribe( user => {
      this.userName = user.name+" "+user.lastName

      if(user.photoUrl)
      {
        this.userPicture = environment.imagesUrl+user.photoUrl
      }
    })

  }
  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }

    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
            return this.listTitles[item].title;
        }
    }
    return '';
  }

  checkRoute(){
    //console.log("trying to check route",this.router)
    if(this.router.url.includes("users") || this.router.url.includes("suppliers") || this.router.url.includes("rules") )
    {
      return true
    }
    return false
  }

  onSearchChange(searchValue: string): void {  
    //console.log(searchValue);
    this.searchService.search(searchValue)
  }

  logout(){
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Vas a salir del sistema!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, adelante!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        let self = this
        this.store.dispatch(AuthActions.logout())
        setTimeout(function(){ self.router.navigate(['login']) }, 1000);           
      }
    })
    
  }

}
