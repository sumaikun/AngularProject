import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {Router} from "@angular/router"
import { Store, select } from "@ngrx/store";

//actions to get
import { selectAllEntities } from "../../store/selectors/users";
import { UsersActions } from "../../store/actions";
import { SearchService } from "../../services/search.service"
import { Subscription }   from 'rxjs';
import { environment } from '../../../environments/environment'
import { PictureModalComponent } from '../../components/picture-modal/picture-modal.component'



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  @ViewChild( PictureModalComponent ) pictureModal: PictureModalComponent ; 

  entities$ = this.store.pipe(select(selectAllEntities));

  entities:Array<any>

  rowsPerPage:number;

  page:number;

  subscription: Subscription;

  userImage: string

  appENV:any

  constructor(private store: Store<any>,
    private router: Router,
    private searchService: SearchService) {

      this.appENV = environment

      //this.entities = []

      searchService.clear()

      this.subscription = searchService.textToSearch$.subscribe( text => {

        if(text.length > 0)
        {
          this.entities = []

          const textToSearch = text.toLocaleLowerCase()
          
          this.entities$.subscribe( data =>  {
            data.forEach(element => {
              if(element.nickname.toLocaleLowerCase().includes(textToSearch)
              || element.email.toLocaleLowerCase().includes(textToSearch)
              || element.role.toLocaleLowerCase().includes(textToSearch)
              || element.name.toLocaleLowerCase().includes(textToSearch)
              || element.lastName.toLocaleLowerCase().includes(textToSearch))
              {
                this.entities.push(element)
              }
            })
          })
        }
        else{
          this.entities$.subscribe( data =>  this.entities = data ) 
        }
        
        
      })

    }

  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadUsers());
    this.rowsPerPage = 10
    this.page = 0
    this.entities$.subscribe( data =>  this.entities = data ) 
  }

  createUser(role): void {
    console.log("createUser")
    this.router.navigate(['user-form/role'+role])
  }

  getRoleCount(role): number{
    return this.entities.filter( data => data.role === role ).length
  }

  watchRecord(entity): void {
    this.store.dispatch(UsersActions.loadUser({id:entity.id}));
    console.log("watch record")
    this.router.navigate(['user-form/view/'+entity.id])
  }

  editRecord(entity): void {
    console.log("entity",entity)
    this.store.dispatch(UsersActions.loadUser({id:entity.id}));
    this.router.navigate(['user-form/edit/'+entity.id])
  }

  changeState(): void {
   
  }

  onPageChange(page:number):void {
    console.log("page to change",page)
    this.page = page
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  ShowPicture(entity):void{
    
    this.userImage = entity.photoUrl ? this.appENV.imagesUrl+entity.photoUrl : this.appENV.defaultImage

    this.pictureModal.open()
  }

}
