import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {Router} from "@angular/router"
import { Store, select } from "@ngrx/store";

//actions to get
import { selectAllEntities } from "../../store/selectors/suppliers";
import { SuppliersActions } from "../../store/actions";
import { SearchService } from "../../services/search.service"
import { Subscription }   from 'rxjs';
import { environment } from '../../../environments/environment'
import { PictureModalComponent } from '../../components/picture-modal/picture-modal.component'
import { selectUser } from 'src/app/store/selectors/auth';


@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit, OnDestroy {

  @ViewChild( PictureModalComponent ) pictureModal: PictureModalComponent ; 

  entities$ = this.store.pipe(select(selectAllEntities));

  entities:Array<any>

  rowsPerPage:number;

  page:number;

  subscription: Subscription;

  supplierImage: string

  appENV:any

  userName:string

  user$ =  this.store.pipe(select(selectUser));

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
              if(element.name.toLocaleLowerCase().includes(textToSearch)
              || element.city.toLocaleLowerCase().includes(textToSearch)
              || element.address.toLocaleLowerCase().includes(textToSearch)
              || element.phone.toLocaleLowerCase().includes(textToSearch))              
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
      this.store.dispatch(SuppliersActions.loadSuppliers());
      this.rowsPerPage = 10
      this.page = 0
      this.entities$.subscribe( data =>  this.entities = data ) 
      this.user$.subscribe( user => this.userName = user.name+" "+user.lastName)
    }
  
    createSupplier(): void {
      console.log("createSupplier")
      this.router.navigate(['supplier-form'])
    }
  
    getRoleCount(role): number{
      return this.entities.filter( data => data.role === role ).length
    }
  
    watchRecord(entity): void {
      this.store.dispatch(SuppliersActions.loadSupplier({id:entity.id}));
      console.log("watch record")
      this.router.navigate(['supplier-form/view/'+entity.id])
    }
  
    editRecord(entity): void {
      console.log("entity",entity)
      this.store.dispatch(SuppliersActions.loadSupplier({id:entity.id}));
      this.router.navigate(['supplier-form/edit/'+entity.id])
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
      
      this.supplierImage = entity.photoUrl ? this.appENV.imagesUrl+entity.photoUrl : this.appENV.defaultImage
  
      this.pictureModal.open()
    }

}
