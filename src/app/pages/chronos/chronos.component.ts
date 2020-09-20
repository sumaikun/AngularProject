import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import {Router} from "@angular/router"
import { Store, select } from "@ngrx/store";

//actions to get
import { selectAllEntities, selectEntityLoaded } from "../../store/selectors/chronos";
import { SuppliersActions, ChronosActions } from "../../store/actions";
import { SearchService } from "../../services/search.service"
import { Subscription }   from 'rxjs';
import { environment } from '../../../environments/environment'
import { PictureModalComponent } from '../../components/picture-modal/picture-modal.component'
import { selectUser } from 'src/app/store/selectors/auth';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { selectAllEntities as selectAll} from "../../store/selectors/suppliers"
import Swal from 'sweetalert2' 

import { RulesService } from '../../services/rules'

import * as moment from 'moment'

@Component({
  selector: 'app-chronos',
  templateUrl: './chronos.component.html',
  styleUrls: ['./chronos.component.scss']
})
export class ChronosComponent implements OnInit, OnDestroy {

  @ViewChild( PictureModalComponent ) pictureModal: PictureModalComponent;
  
  @ViewChild('content') content:ElementRef;

  @ViewChild('content2') content2:ElementRef;

  entities$ = this.store.pipe(select(selectAllEntities));

  loaded$ =  this.store.pipe(select(selectEntityLoaded));

  entities:Array<any>

  rowsPerPage:number;

  page:number;

  subscription: Subscription;

  supplierImage: string

  appENV:any

  userName:string

  cronjob:any

  isFormDisabled:boolean

  suppliers$ = this.store.pipe(select(selectAll));

  user$ =  this.store.pipe(select(selectUser));

  supplierRules: any

  buttonWasPressed: boolean

  idsChecked:Array<string>

  intervals:any  

  countDowns:any

  constructor(private store: Store<any>,
    private rulesService: RulesService,
    private router: Router,
    private searchService: SearchService,
    private modalService: NgbModal) { 

      this.appENV = environment

      //this.entities = []

      searchService.clear()

    }
  
    ngOnInit(): void {
      this.store.dispatch(SuppliersActions.loadSuppliers());
      this.store.dispatch(ChronosActions.loadChronos());
      this.rowsPerPage = 9
      this.page = 0
      
      this.entities$.subscribe( data =>  this.entities = data )
      this.entities$.subscribe( data =>  { console.log("chronos",data)  })

      this.user$.subscribe( user => this.userName = user.name+" "+user.lastName)

      this.cronjob = {
        title:null,
        supplier:null,
        description:null,
        automatical:false,
        rules:[],
        executeHour:null
      }

      this.isFormDisabled = false

      this.buttonWasPressed = false

      this.idsChecked = []

      this.countDowns = {}

      this.intervals = {}

    }
  
    createSupplier(): void {
      console.log("createSupplier")
      this.router.navigate(['supplier-form'])
    } 
  
  
    watchRecord(entity): void {

      this.idsChecked = entity.rules
      this.cronjob = {
        title:entity.title,
        supplier:entity.supplier,
        description:entity.description,
        automatical:entity.automatical,
        rules:entity.rules,
        executeHour:entity.executeHour
      }
      this.openFormModal()

      this.isFormDisabled = true     
    }
  
    editRecord(entity): void {
      this.idsChecked = entity.rules
      this.cronjob = {
        title:entity.title,
        supplier:entity.supplier?.id,
        description:entity.description,
        automatical:entity.automatical,
        rules:entity.rules,
        executeHour:entity.executeHour
      }
      this.openFormModal()
    }
  
    changeState(): void {
     
    }
  
    onPageChange(page:number):void {
      console.log("page to change",page)
      this.page = page
    }
  
    ngOnDestroy() {
      // prevent memory leak when component destroyed
      //this.subscription.unsubscribe();
    }
  
    ShowPicture(entity):void{
      
      this.supplierImage = entity.photoUrl ? this.appENV.imagesUrl+entity.photoUrl : this.appENV.defaultImage
  
      this.pictureModal.open()
    }

    createCrontab(){
      this.idsChecked = []
      this.cronjob = {
        title:null,
        supplier:null,
        description:null,
        automatical:false,
        rules:[],
        executeHour:null
      }
      this.openFormModal()
    }


    openFormModal(){
      this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {

        console.log("result",result)
        this.cronjob.rules = this.idsChecked

        if( !this.cronjob.title || !this.cronjob.supplier || !this.cronjob.description
           || !this.cronjob.executeHour || this.cronjob.rules.length == 0 )
        {
          return Swal.fire(
            'Espera',
            'Todos los campos deben tener información relacionada',
            'warning'
          )
        }

        this.saveChronos(this.cronjob)

      }, (reason) => {
        console.log("reason",reason)
      });
    }

    openRulesModal() {

      console.log(this.cronjob.supplier)
  
      if(!this.cronjob.supplier)
      {
        return Swal.fire(
          'Espera',
          'Pon el catalogo relacionado',
          'warning'
        )
      }
  
      this.rulesService.getBySupplier(this.cronjob.supplier).subscribe( data =>  this.supplierRules = data )
  
      this.modalService.open(this.content2, {ariaLabelledBy: 'modal-basic-title',size:'lg'}).result.then((result) => {

        console.log("result",this.idsChecked)

      }, (reason) => {
        console.log("reason",reason)
      })

    }


    async saveChronos(chronosData) {

      this.buttonWasPressed = true
  
      console.log("chronosData",chronosData)
      //event.preventDefault()    
      
      if(chronosData.id)
      {
        console.log("update action")
        
        this.store.dispatch(ChronosActions.updateChronos(
          {id:chronosData.id,data:chronosData}
        ))
  
      }
      else{
        
        console.log("create action")
        this.store.dispatch(ChronosActions.createChronos({ data:chronosData }))
      
      }    
  
      this.modalService.dismissAll()
  
      this.loaded$.subscribe( loaded => {
  
        console.log("loaded",loaded,this.buttonWasPressed)
  
        if(loaded && this.buttonWasPressed ){
  
          this.buttonWasPressed = false
  
          let self = this
  
          window.setTimeout(function(){ self.store.dispatch(ChronosActions.loadChronos()); }, 1000)
          
  
          return Swal.fire(
            'Bien',
            'Datos registrados',
            'success'
          )
        }
      })    
  
    }

    onCheckChange2(entity,checked):void{
      console.log(entity,checked)
  
      if(checked)
      {
        this.idsChecked.push(entity.id)
      }else{
        const index = this.idsChecked.indexOf(entity.id);
        if (index > -1) {
          this.idsChecked.splice(index, 1);
        }
      }
  
    }
  
    isItemChecked(id):boolean{
      return this.idsChecked.includes(id)
    }

    

    formatTimeLeft(entity) {   
 
      if(isNaN(this.countDowns[entity.id]))
      {

        const now = moment()  
        const startTime = moment(moment(now).format("HH:mm:ss"), "HH:mm:ss");
        const endTime = moment(entity.executeHour, "HH:mm:ss");

        // calculate total duration
        const duration = moment.duration(endTime.diff(startTime));

        // duration in hours
        //console.log("hours",duration.asHours());

        // duration in minutes
        //console.log("minutes",duration.asMinutes());
        
        let totalSeconds = 0  

        if(  duration.asMinutes() < 0 )
        {
          totalSeconds = (1440 + duration.asMinutes()) * 60  
        }else{
          totalSeconds = duration.asMinutes() * 60
        }

        this.countDowns[entity.id] = totalSeconds

        if(isNaN(this.intervals[entity.id]))
        {
          this.intervals[entity.id] = setInterval(() => {
            if(this.countDowns[entity.id] > 0) {
              this.countDowns[entity.id] --;
            } else {
              clearInterval(this.intervals[entity.id]);
            }
          },1000)
        }        

      }
      
      //console.log(  "this.countDowns[entity]", this.countDowns[entity.id] )

      return this.formatTime(this.countDowns[entity.id])
      
    }

    formatTime(time){

      const hours = Math.floor(time / 3600);

      // The largest round integer less than or equal to the result of time divided being by 60.
      const minutes = Math.floor(time / 60)% 60;
      
      // Seconds are the remainder of the time divided by 60 (modulus operator)
      let seconds = time % 60;

      let secondsString = seconds.toString()
      
      // If the value of seconds is less than 10, then display seconds with a leading zero
      if (seconds < 10) {
        secondsString = `0${seconds}`;
      }
    
      // The output in MM:SS format
      return `${hours}:${minutes}:${parseInt(secondsString)}`;
    }

}
