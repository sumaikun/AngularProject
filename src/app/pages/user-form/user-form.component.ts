import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { User } from '../../models/user';
import { UsersActions } from "../../store/actions";
import { Store, select } from "@ngrx/store";
import { selectError, selectEntityLoaded, selectAllEntities, selectEntityIds } from "../../store/selectors/users";
import Swal from 'sweetalert2' 
import { ActivatedRoute } from '@angular/router';
import { FilesService } from '../../services/files.service'
import { PictureModalComponent } from '../../components/picture-modal/picture-modal.component'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  @ViewChild('userForm') userFormElement;

  @ViewChild( PictureModalComponent ) pictureModal: PictureModalComponent ; 

  checkoutForm;

  error$ = this.store.pipe(select(selectError));

  loaded$ =  this.store.pipe(select(selectEntityLoaded));
  
  entities$ =  this.store.pipe(select(selectAllEntities));

  //entityIds$ =  this.store.pipe(select(selectEntityIds));

  defaultRole:string

  mode:string

  @ViewChild('password') password:ElementRef;

  @ViewChild('confirmPassword') confirmPassword:ElementRef;

  userImage: string | ArrayBuffer

  fileToSave: string

  constructor(private formBuilder: FormBuilder,
    private store: Store<any>,
    private route: ActivatedRoute,
    private filesService: FilesService,
   ){
    this.checkoutForm = this.formBuilder.group(new User());  
    //this.entityIds$.subscribe( data => console.log(data) )
    this.userImage = environment.defaultImage
    
  }

  ngOnInit(): void {
    
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
            message = '¡Verifica!, debe haber un usuario con nick o correo igual ya registrado'
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

          delete entity["password"]

          this.checkoutForm = this.formBuilder.group( entity )
          this.userImage = environment.imagesUrl+entity.photoUrl
        })

        if(params.mode === "view")
        {
          this.checkoutForm.disable()
        }
        
      }
      

      if(params.mode.includes("role"))
      {
        const defaultRole = params.mode.replace('role','')
        this.checkoutForm.patchValue({role: defaultRole})
      }
    });   

  }

  async onSubmit(userData) {

    console.log("userData",userData)

    

    if(this.fileToSave)
    {
      
      if(userData.photoUrl){
        console.log("delete file")
        this.filesService.deleteFile(userData.photoUrl)
        .subscribe( info => console.log("deleteInfo",info))
      }

      //console.log("this.fileToSave",this.fileToSave)

      await this.filesService.saveFile(this.fileToSave).toPromise()
      .then( data => {
        console.log(data)
        userData.photoUrl = data[0].filename
      })
    }   

    console.log("userData",userData)
    //event.preventDefault()

    if(this.password.nativeElement.value)
    {
      //console.log("checkPasswords",this.confirmPassword.nativeElement.value)

      if(this.password.nativeElement.value.length < 7)
      {
        return Swal.fire(
          'Espera',
          'La contraseña debe tener 7 dígitos por lo menos',
          'warning'
        );
      }

      if(this.password.nativeElement.value != this.confirmPassword.nativeElement.value)
      {
        return Swal.fire(
          'Espera',
          'Las contraseñas no son similares',
          'warning'
        );
      }
      else{
        userData.password = this.password.nativeElement.value
      }
      
    }

    
    if(!userData.state)
    {
      userData.state = "ACTIVE"
    }
    
    if(userData.id)
    {
      console.log("update action")
      
      this.store.dispatch(UsersActions.updateUser(
        {id:userData.id,data:userData}
      ))

    }
    else{
      console.log("create action")
      this.store.dispatch(UsersActions.createUser({ data:userData }))
      
      this.entities$.subscribe( data => {
        this.checkoutForm.patchValue({id: data[data.length -1].id,
          photoUrl:data[data.length -1].photoUrl})
      })

    } 

    this.loaded$.subscribe( loaded => {
      if(loaded){
        return Swal.fire(
          'Bien',
          'Datos registrados',
          'success'
        )
      }
    })    

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
          self.userImage = reader.result

        }, false);

        const url = reader.readAsDataURL(file);

        this.fileToSave = file

      }
    }
    
  }

  ShowPicture():void{
    this.pictureModal.open()
  }

  /*submitForm(){
    this.userFormElement.nativeElement.submit();
    event.preventDefault()
  }*/



}
