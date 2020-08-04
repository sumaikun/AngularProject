import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {Router} from "@angular/router"
import { Store, select } from "@ngrx/store";

//actions to get
import { selectAllEntities, selectEntityLoaded } from "../../store/selectors/users";
import { UsersActions } from "../../store/actions";
import { SearchService } from "../../services/search.service"
import { Subscription }   from 'rxjs';
import { environment } from '../../../environments/environment'
import { PictureModalComponent } from '../../components/picture-modal/picture-modal.component'
import { selectUser } from 'src/app/store/selectors/auth';


import { SelectTableComponent } from '../../components/select-table/select-table.component'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  @ViewChild( PictureModalComponent ) pictureModal: PictureModalComponent ;
  
  @ViewChild( SelectTableComponent  ) selectTableModal: SelectTableComponent 

  entities$ = this.store.pipe(select(selectAllEntities));

  loaded$ =  this.store.pipe(select(selectEntityLoaded));

  entities:Array<any>

  rowsPerPage:number;

  page:number;

  subscription: Subscription;

  userImage: string

  appENV:any

  userName:string

  user$ =  this.store.pipe(select(selectUser));

  selectTableHeaders:Array<any>

  entityToUpdate:any;

  buttonWasPressed: boolean

  constructor(private store: Store<any>,
    private router: Router,
    private searchService: SearchService) {

      this.appENV = environment

      this.selectTableHeaders = [
        {"key":"name","displayName":"Nombre"},
        {"key":"city","displayName":"Ciudad"},
        {"key":"type","displayName":"Tipo"},
      ]

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

    this.store.dispatch(UsersActions.offLoad())
    this.buttonWasPressed = false
    this.store.dispatch(UsersActions.loadUsers());
    this.rowsPerPage = 10
    this.page = 0
    this.entities$.subscribe( data =>  this.entities = data ) 
    this.user$.subscribe( user => this.userName = user.name+" "+user.lastName)
  
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

  addPermissions(entity): void {

    this.entityToUpdate = entity

    const selectedIds = []

    entity.suppliers.forEach(element => {
      console.log("element",element)
      selectedIds.push(element.id)
    });

    console.log("this.selectedIds",selectedIds)

    this.selectTableModal.idsChecked = selectedIds

    this.selectTableModal.open()
  }

  changeState(): void {
   
  }

  onPageChange(page:number):void {
    console.log("page to change",page)
    this.page = page
  }

  onidsSelectedEvent(suppliers:Array<string>):void {

    this.buttonWasPressed = true

    console.log("suppliers",suppliers)

    const dataToSave = { ...this.entityToUpdate , suppliers }

    //this.entityToUpdate.suppliers = suppliers

    delete dataToSave.password

    this.store.dispatch(UsersActions.updateUser({ id:this.entityToUpdate.id, data: dataToSave }))

    this.loaded$.subscribe( loaded => {

      console.log("loaded",loaded,this.buttonWasPressed)

      if(loaded && this.buttonWasPressed ){

        this.buttonWasPressed = false
        this.store.dispatch(UsersActions.loadUsers());
              
      }
    })    

    
    

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
