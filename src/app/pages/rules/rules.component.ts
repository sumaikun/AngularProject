import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from "@ngrx/store"
import { SuppliersActions, RulesActions } from "../../store/actions"
import { selectAllEntities as selectAll} from "../../store/selectors/suppliers"
import { selectAllEntities , selectEntityLoaded, selectError } from "../../store/selectors/rules";
import Swal from 'sweetalert2' 
import { SearchService } from "../../services/search.service"
import { Subscription }   from 'rxjs';
import { RulesService } from '../../services/rules';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  error$ = this.store.pipe(select(selectError));

  loaded$ =  this.store.pipe(select(selectEntityLoaded));
  
  entities$ =  this.store.pipe(select(selectAllEntities));

  @ViewChild('content') content:ElementRef;

  @ViewChild('content2') content2:ElementRef;

  @ViewChild('content3') content3:ElementRef;

  suppliers$ = this.store.pipe(select(selectAll));

  rule:any

  buttonWasPressed: boolean

  suppliers: any[]

  isFormDisabled:boolean

  rules: any[]

  ruleVersions: any

  supplierToClone:string

  rowsPerPage:number;

  page:number;

  subscription: Subscription;

  subscription2: Subscription;

  subscription3: Subscription;

  apiError: boolean

  constructor(private modalService: NgbModal,
    private searchService: SearchService,
    private rulesService: RulesService,
    private store: Store<any>) {

      this.apiError = false

      searchService.clear()

      this.subscription = searchService.textToSearch$.subscribe( text => {

        if(text.length > 0)
        {
          this.rules = []

          const textToSearch = text.toLocaleLowerCase()
          
          this.entities$.subscribe( data =>  {
            data.forEach(element => {

              const ruleTypeName = this.getRuleTypeName(element.ruleType)

              const supplierName = this.getSupplierName(element.supplier)
              
              if(ruleTypeName?.toLocaleLowerCase().includes(textToSearch.toLocaleLowerCase())
              || supplierName?.toLocaleLowerCase().includes(textToSearch.toLocaleLowerCase())
              || element.operationType?.toLocaleLowerCase().includes(textToSearch.toLocaleLowerCase())
              || element.if?.toLocaleLowerCase().includes(textToSearch.toLocaleLowerCase())
              || element.then?.toLocaleLowerCase().includes(textToSearch.toLocaleLowerCase()))
              {
                this.rules.push(element)
              }
            })
          })
        }
        else{
          this.entities$.subscribe( data =>  this.rules = data ) 
        }
        
        
      })

      this.subscription2 = this.error$.subscribe( error => {
      
        console.log("error",error,this.buttonWasPressed)
        if( this.buttonWasPressed ){
          this.apiError = true
          
          if(error.error.message && error.error.message.includes("Can not update rule with the same data"))
          {
            return Swal.fire(
              'Espera',
              'No se puede actualizar una regla con la misma información',
              'warning'
            ).then( any =>  this.apiError = false )
          }

          return Swal.fire(
            'Espera',
            'Sucedio un error',
            'error'
          ).then( any =>  this.apiError = false )
          
        }
        
      })
  
      this.subscription3 = this.loaded$.subscribe( loaded => {
  
        console.log("loaded",loaded,this.buttonWasPressed,this.apiError)

        this.store.dispatch(RulesActions.offLoad());
  
        if(loaded && this.buttonWasPressed && !this.apiError ){
  
          this.buttonWasPressed = false
  
          let self = this
  
          window.setTimeout(function(){ self.store.dispatch(RulesActions.loadRules()); }, 1000)
          
  
          return Swal.fire(
            'Bien',
            'Datos registrados',
            'success'
          )
        }
      })    
  }

  onPageChange(page:number):void {
    console.log("page to change",page)
    this.page = page
  }

  ngOnDestroy() {
    console.log("destroy component")
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
  }

  shopifyFields = [
    { id: 'title', name: 'title' },
    { id: 'body_html', name: 'body_html' },
    { id: 'product_type', name: 'product_type' },
    { id: 'handle', name: 'handle' },
    { id: 'tags', name: 'tags' },
];

  
  ngOnInit(): void {

    this.rowsPerPage = 10
    this.page = 0

    this.store.dispatch(RulesActions.offLoad());

    this.store.dispatch(SuppliersActions.loadSuppliers());

    this.store.dispatch(RulesActions.loadRules());

    this.suppliers$.subscribe( data => {
      this.suppliers = data
    })

    this.entities$.subscribe( data => {
      this.rules = data
    })

    this.rule = {
      ruleType:null,
      supplier:null,
      operationType:null,
      selectedFields:[],
      if:null,
      then:null,
      similarity:null
    }

    this.isFormDisabled = false



  }

  createRule(){
    this.openRulesModal()  
  }

  openRulesModal() {
    
    this.rule = {
      id:null,
      ruleType:null,
      supplier:null,
      operationType:null,
      selectedFields:[],
      fieldsToCheck:[],
      if:null,
      then:null,
      similarity:null
    }
    
    this.isFormDisabled = false

    this.openModal()
  }

  openModal(){
    this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log("result",result,this.rule)
    }, (reason) => {
      console.log("reason",reason)
    });
  }

  ruleTypeChange(event){
    console.log("value",event.target.value)
  }

  checkRuleToSave(){
    console.log("rule",this.rule)

    if(!this.rule.ruleType)
    {
      return Swal.fire(
        'Espera',
        'Pon el tipo de regla',
        'warning'
      )
    }

    if(!this.rule.supplier)
    {
      return Swal.fire(
        'Espera',
        'Pon el catalogo relacionado',
        'warning'
      )
    }

    //////////  Grammar correction validation

    if(this.rule.ruleType === "GRAMMAR_CORRECTION" && !this.rule.operationType )
    {
      return Swal.fire(
        'Espera',
        'La corrección gramatical necesita un tipo de operación',
        'warning'
      )
    }

    if(this.rule.ruleType === "GRAMMAR_CORRECTION" && ( this.rule.operationType === "REPLACE" || this.rule.operationType === "ADD" )
     && ( !this.rule.if || !this.rule.then ) )
    {
      return Swal.fire(
        'Espera',
        'Para reemplazar debes poner las condiciones',
        'warning'
      )
    }

    if(this.rule.ruleType === "GRAMMAR_CORRECTION" && this.rule.operationType === "DELETE" &&  !this.rule.if  )
    {
      return Swal.fire(
        'Espera',
        'Debes poner la palabra a eliminar',
        'warning'
      )
    }

    if(this.rule.ruleType === "GRAMMAR_CORRECTION" && this.rule.similarity && (this.rule.similarity < 0 
      || this.rule.similarity > 100 ) )
      {
       return Swal.fire(
         'Espera',
         'El valor debe estar entre 0 y 100',
         'warning'
       )
      }

    //////////  Prices validation

    if(this.rule.ruleType === "PRICES" &&   !this.rule.then )
    {
      return Swal.fire(
        'Espera',
        'Para validar precio por lo menos debes tener el campo formula',
        'warning'
      )
    }

    if(this.rule.ruleType === "PRICES" && (  !this.rule.then )  && this.rule.if && !this.rule.fieldsToCheck )
    {
      return Swal.fire(
        'Espera',
        'Para validar precio de esta manera debes llenar todos los campos',
        'warning'
      )
    }

    if(this.rule.ruleType === "PRICES" && (  !this.rule.then )  && !this.rule.if && this.rule.fieldsToCheck )
    {
      return Swal.fire(
        'Espera',
        'Debes los campos faltantes para validar la regla de precios de esta forma',
        'warning'
      )
    }

    if(this.rule.ruleType === "PRICES" &&
     !this.rule.then.includes("price*") &&
      !this.rule.then.includes("price+(")){
      return Swal.fire(
        'Espera',
        'La regla de precios debe incluir las palabras price* o la pablara price+(',
        'warning'
      )
    }


    if((this.rule.ruleType === "PRICES" && this.rule.then.includes("price*"))){
      const numberToMultiply = this.rule.then.replace("price*", '')
      if ( isNaN(parseInt(numberToMultiply))) {
        return Swal.fire(
          'Espera',
          'Después de la palabra price*  debe aparecer un número, no se reconocio el número',
          'warning'
        )
      }
    }

    if(this.rule.ruleType === "PRICES" && this.rule.then.includes("price+(")){
      const checkFormat = this.rule.then.substring(
        this.rule.then.lastIndexOf("(") + 1, 
        this.rule.then.lastIndexOf(")")
      );

      if(!checkFormat.includes("%"))
      {
        return Swal.fire(
          'Espera',
          'Para incluir una regla del porcentaje debes incluir el simbolo del porcentaje',
          'warning'
        )  
      }

      const numberToMultiply = checkFormat.replace("%", '')

      console.log("numberToMultiply",numberToMultiply,parseInt(numberToMultiply),isNaN(parseInt(numberToMultiply)))

      if( isNaN(parseInt(numberToMultiply)) ) {
        return Swal.fire(
          'Espera',
          'En la regla del porcentaje (%) debe aparecer un número, no se reconocio el número',
          'warning'
        )
      }

    }  

     //////////  Prices validation

     if(this.rule.ruleType === "COLOR" && (  !this.rule.if  && !this.rule.then ) )
    {
      return Swal.fire(
        'Espera',
        'Para reemplazar el color debes tener todos los campos',
        'warning'
      )
    } 

     const exist = this.checkIfRuleExist(this.rule)

     console.log("exist",exist)

     if(exist.length == 0)
     {
        this.saveRule(this.rule)    
     }
     else{
      
      switch (exist) {
        case "field exist on another rule":
          
          return Swal.fire(
            'Espera',
            'Uno de los valores (si) ya existe en otra regla para el mismo catálogo, edite esta regla si quiere cambiarla',
            'warning'
          )

        case "field exist with same then":
          return Swal.fire(
            'Espera',
            'La conclusión (then) ya existe en otra regla para el mismo catálogo, no es necesario crear una nueva editela',
            'warning'
          )
        
        case "only one  general rule price by supplier":
          return Swal.fire(
            'Espera',
            'Solo puede haber una regla de precio general por proveedor',
            'warning'
          )
      }

     }

     //console.log("test",this.rule.if.split(","))

    //

  }

  async saveRule(ruleData) {

    this.buttonWasPressed = true

    console.log("ruleData",ruleData)
    //event.preventDefault()    
    
    if(ruleData.id)
    {
      const self = this
      Swal.fire({
        title: '¿Estas seguro ?',
        text: "Creara una nueva version de la regla",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si,¡adelante!'
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("update action")
      
          self.store.dispatch(RulesActions.updateRule(
            {id:ruleData.id,data:ruleData}
          ))
        }
      })

      

    }
    else{
      
      console.log("create action")
      this.store.dispatch(RulesActions.createRule({ data:ruleData }))
    
    }    

    this.modalService.dismissAll()

  }

  checkIfRuleExist(rule){

    let exist = ""

      if(rule.ruleType === "GRAMMAR_CORRECTION")
      {
        const results = this.rules.filter( frule => frule.ruleType === rule.ruleType &&
           frule.operationType === rule.operationType  && frule.supplier === rule.supplier ) 
           
        console.log("results",results)

        results.map( result =>  {
          rule.if.split(",").map( field => {
            console.log("field",field)
            if(result.if.includes(field) && rule.id != result.id ){
              exist = "field exist on another rule"
            }
          })
        })  

        const results2 = this.rules.filter( frule =>  frule.ruleType === rule.ruleType && 
          frule.then === rule.then && frule.supplier === rule.supplier && rule.id != frule.id && 
          frule.operationType === rule.operationType )

        console.log("results2",results2)

        if(results2.length > 0)
        {
          exist = "field exist with same then"
        }

      }
      
      if(rule.ruleType === "COLOR")
      {
        const results2 = this.rules.filter( frule =>  frule.ruleType === rule.ruleType && 
          frule.then === rule.then && frule.supplier === rule.supplier )

        console.log("results2",results2)

        if(results2.length > 0)
        {
          exist = "field exist with same then"
        }
      }

      if(rule.ruleType === "PRICES" ){
        const results = this.rules.filter( frule => frule.ruleType === rule.ruleType &&
          frule.supplier === rule.supplier && frule.then && !frule.if &&  !frule.fieldsToCheck   ) 

        console.log("results",results)

        if(results.length > 0)
        {
          exist = "only one  general rule price by supplier"
        }

        const results2 = this.rules.filter( frule => frule.ruleType === rule.ruleType &&
          frule.supplier === rule.supplier && frule.if ) 

          results2.map( result2 =>  {
          rule.if.split(",").map( field => {
            console.log("field",field)
            if(result2.if.includes(field) && rule.id != result2.id ){
              exist = "field exist on another rule"
            }
          })
        })       
      }

    return exist

  }

  getSupplierName( supplierId ){
    return this.suppliers.filter( data => data.id === supplierId )[0].name 
  }

  getRuleTypeName( name ){

    let expr

    switch (name) {
      case 'GRAMMAR_CORRECTION':
        expr = "Corrección gramatical"
        break;
      case 'PRICES':
        expr = "Corrección de precios"
        break;
      case 'COLOR':
        expr = "Corrección de color"
        break;
      default:
        expr = ""
    }

    return expr
  }

  watchRecord( rule ){
    console.log("rule",rule)

    this.rule = {
      id:rule.id,
      ruleType:rule.ruleType,
      supplier:rule.supplier,
      operationType:rule.operationType,
      selectedFields:rule.selectedFields,
      if:rule.if,
      then:rule.then,
      similarity:rule.similarity,
      fieldsToCheck:rule.fieldsToCheck
    }

    this.openModal()

    this.isFormDisabled = true
  }

  editRecord( rule ){
    
    this.rule = {
      id:rule.id,
      ruleType:rule.ruleType,
      supplier:rule.supplier,
      operationType:rule.operationType,
      selectedFields:rule.selectedFields,
      if:rule.if,
      then:rule.then,
      similarity:rule.similarity,
      fieldsToCheck:rule.fieldsToCheck
    }

    this.openModal()

    this.isFormDisabled = false
  }

  checkVersions( rule ){

    this.rulesService.getVersions( rule.id ).subscribe( versions => this.ruleVersions = versions )

    this.openVersionModal()
  }

  comeBackVersions( version ){
    console.log("version",version)
    this.buttonWasPressed = true
    Swal.fire({
      title: '¿Estas seguro ?',
      text: "La regla y sus condiciones en el chronos cambiara",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si,¡adelante!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(RulesActions.updateRule(
          {id:version.originalRule,data:{
            id:version.originalRule,
            ruleType:version.ruleType,
            supplier:version.supplier,
            operationType:version.operationType,
            selectedFields:version.selectedFields,
            fieldsToCheck:version.fieldsToCheck,
            if:version.if,
            then:version.then,
            similarity:version.similarity
          }}
        ))
      }
    })


  }

  openCloneModal( rule ){
    this.supplierToClone = "" 
    this.modalService.open(this.content2, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log("result",result,rule)
      
      if(!this.supplierToClone){
        return Swal.fire(
          'Espera',
          'Debes seleccionar un proveedor para continuar',
          'warning'
        )
      }
      else{

        const newRuleToSave = {
          fieldsToCheck: rule.fieldsToCheck,
          id: null,
          if: rule.if,
          operationType: rule.operationType,
          ruleType: rule.ruleType,
          selectedFields: rule.selectedFields,
          similarity: rule.similarity,
          supplier: this.supplierToClone,
          then: rule.then
        }

        const exist = this.checkIfRuleExist(newRuleToSave)

        console.log("exist",exist)

        if(exist.length == 0)
        {
            this.saveRule(newRuleToSave)    
        }
        else{
          
          switch (exist) {
            case "field exist on another rule":
              
              return Swal.fire(
                'Espera',
                'Uno de los valores (si) ya existe en otra regla para el mismo catálogo, edite esta regla si quiere cambiarla',
                'warning'
              )

            case "field exist with same then":
              return Swal.fire(
                'Espera',
                'La conclusión (then) ya existe en otra regla para el mismo catálogo, no es necesario crear una nueva editela',
                'warning'
              )

            case "only one  general rule price by supplier":
              return Swal.fire(
                'Espera',
                'Solo puede haber una regla general de precio por proveedor',
                'warning'
              )
          }
        }


      }
      
    }, (reason) => {
      console.log("reason",reason)
    });
  }


  openVersionModal(  ){
  
    this.modalService.open(this.content3, {ariaLabelledBy: 'modal-basic-title', size:'lg'}).result.then((result) => {
    }, (reason) => {
      console.log("reason",reason)
    })
  }


}
