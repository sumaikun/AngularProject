import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Supplier } from '../../models/supplier';
import { SuppliersActions } from "../../store/actions";
import { Store, select } from "@ngrx/store";
import { selectError, selectEntityLoaded, selectAllEntities, selectEntityIds } from "../../store/selectors/suppliers";
import Swal from 'sweetalert2' 
import { ActivatedRoute } from '@angular/router';
import { FilesService } from '../../services/files.service'
import { PictureModalComponent } from '../../components/picture-modal/picture-modal.component'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-suppliers-form',
  templateUrl: './suppliers-form.component.html',
  styleUrls: ['./suppliers-form.component.css']
})
export class SuppliersFormComponent implements OnInit {

  @ViewChild('supplierForm') supplierFormElement;

  @ViewChild( PictureModalComponent ) pictureModal: PictureModalComponent ; 

  checkoutForm;

  error$ = this.store.pipe(select(selectError));

  loaded$ =  this.store.pipe(select(selectEntityLoaded));
  
  entities$ =  this.store.pipe(select(selectAllEntities));

  //entityIds$ =  this.store.pipe(select(selectEntityIds));

  defaultRole:string

  mode:string  

  supplierImage: string | ArrayBuffer

  fileToSave: string

  buttonWasPressed: boolean

  constructor(private formBuilder: FormBuilder,
    private store: Store<any>,
    private route: ActivatedRoute,
    private filesService: FilesService) {
      this.checkoutForm = this.formBuilder.group(new Supplier());  
      this.supplierImage = environment.defaultImage
    }

  ngOnInit(): void {
    
    this.store.dispatch(SuppliersActions.offLoad())

    this.buttonWasPressed = false

    console.log("init component",this.buttonWasPressed)

    this.error$.subscribe( data => { 
      
      console.log("state",data)
    
      if(data && data.status === 400)
      {
        if(data.error.message && typeof data.error.message != 'string' )
        {
          const div = document.createElement('div');
          div.innerHTML = 'Parece que no se han mandado los datos correctamente: <br><br>';
          const list = document.createElement('ul');
          
          data.error.message.forEach(element => {
            const listItem = document.createElement('li');
            listItem.innerHTML = element;
            listItem.style.textAlign = 'justify';
            list.appendChild(listItem)
          });        
          
          div.appendChild(list)

          return Swal.fire({
            title:'Espera',
            icon:'warning',
            html:div
          })
  
        }
        else{

          return Swal.fire({
            title:'Espera',
            icon:'warning',
            text:'Sucedio un error'
          })

        }
        
        
      }
      
      if(data && data.status === 500)
      {
        let message;

        if(data.error.message.includes("duplicate key error"))
        {
          message = '¡Verifica!, debe haber un proveedor con un nombre igual ya registrado'
        }
        else{
          message = 'Existen errores de conexión con el servidor'
        }

        return Swal.fire(
          'Ooops',
          message,
          'error'
        )
      }
       
  })

    this.route.params.subscribe(params => {

      console.log("params",params)

      if(params.mode === "edit" ||  params.mode === "view")
      {

        this.mode = params.mode

        this.entities$.subscribe( data => {
          const entity = data.filter( data => data.id === params["id"] )[0]

          console.log("entity",entity)

          //delete entity["password"]

          this.checkoutForm = this.formBuilder.group( entity )
          
          if(entity.photoUrl){this.supplierImage = environment.imagesUrl+entity.photoUrl}
          
        })

        if(params.mode === "view")
        {
          this.checkoutForm.disable()
        }
        
      }
      

      

    });  
  }

  async onSubmit(registerData) {

    console.log("registerData",registerData)    

    //event.preventDefault()

    this.buttonWasPressed = true
 
    if(registerData.id)
    {
      console.log("update action")
      
      this.store.dispatch(SuppliersActions.updateSupplier(
        {id:registerData.id,data:registerData}
      ))
    }
    else{
      console.log("create action")
      this.store.dispatch(SuppliersActions.createSupplier({ data:registerData }))   

    }

    this.loaded$.subscribe( loaded => {

      console.log("loaded",loaded, this.buttonWasPressed)

      if(loaded && this.buttonWasPressed ){

        this.buttonWasPressed = false

        //console.log("loaded",loaded)        

        if(!registerData.id)
        {
          this.entities$.subscribe( data => {

            console.log("data create",data)
            
            this.checkoutForm.patchValue({id: data[data.length -1].id,
              photoUrl:data[data.length -1].photoUrl})
    
            this.saveFile(registerData)            
    
          })
        }else{
          this.saveFile(registerData)
        }

        return Swal.fire(
          'Bien',
          'Datos registrados',
          'success'
        )
      }
    })
    
    

  }

  saveFile(registerData){

    console.log(registerData.id,"this.checkoutForm",this.checkoutForm.controls.id.value)

    const id = registerData.id || this.checkoutForm.controls.id.value

    if(this.fileToSave)
    {
      
      if(registerData.photoUrl){
        console.log("delete file")
        this.filesService.deleteFile(registerData.photoUrl)
        .subscribe( info => console.log("deleteInfo",info))
      }

      //console.log("this.fileToSave",this.fileToSave)

      this.filesService.saveFile(this.fileToSave)
      .subscribe( data => {
        console.log(data)

        const updateRegister = { ...registerData, id:id, photoUrl:data[0].filename  }

        this.checkoutForm.patchValue({photoUrl:data[0].filename})
              
        console.log("registerData",updateRegister)
        
        this.store.dispatch(SuppliersActions.updateSupplier(
          {id:id,data:updateRegister}
        ))
        
        const self = this 

        //window.setTimeout(function(){ self.store.dispatch(SuppliersActions.offLoad()) }, 1000);

        

      })

      this.fileToSave = null 
      

    }    
    
  }

  onFileSelect(event) {
    
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      if(!file.type.includes("jpg") && !file.type.includes("png") 
      && !file.type.includes("gif") && !file.type.includes("jpeg") ){
      
        return    Swal.fire({
              icon: 'error',
              title: 'Espera',
              text: "Solo se permiten imagenes",          
          })
      }else{

        let self = this
        const reader = new FileReader();
        reader.addEventListener("load", function () {
          // convert image file to base64 string
          //console.log(reader.result)
          self.supplierImage = reader.result

        }, false);

        const url = reader.readAsDataURL(file);

        this.fileToSave = file

      }
    }
    
  }

  ShowPicture():void{
    this.pictureModal.open()
  }



}
