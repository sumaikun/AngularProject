import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from "@ngrx/store"
import { SuppliersActions, RulesActions } from "../../store/actions"
import { selectAllEntities as selectAll} from "../../store/selectors/suppliers"
import { selectAllEntities , selectEntityLoaded, selectError } from "../../store/selectors/rules";
import Swal from 'sweetalert2' 
import { SearchService } from "../../services/search.service"
import { Subscription }   from 'rxjs';

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

  suppliers$ = this.store.pipe(select(selectAll));

  rule:any

  buttonWasPressed: boolean

  suppliers: any[]

  isFormDisabled:boolean

  rules: any[]

  supplierToClone:string

  rowsPerPage:number;

  page:number;

  subscription: Subscription;

  subscription2: Subscription;

  subscription3: Subscription;

  apiError: boolean

  constructor(private modalService: NgbModal,
    private searchService: SearchService,
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
              
              if(ruleTypeName.toLocaleLowerCase().includes(textToSearch)
              || supplierName.toLocaleLowerCase().includes(textToSearch)
              || element.operationType.toLocaleLowerCase().includes(textToSearch)
              || element.if.toLocaleLowerCase().includes(textToSearch)
              || element.then.toLocaleLowerCase().includes(textToSearch))
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

          if(error.message && error.message.includes("Can not update rule with the same data"))
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

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
  }

    
  
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

    if((this.rule.ruleType === "PRICES" && !this.rule.then.includes("price*"))){
      return Swal.fire(
        'Espera',
        'La regla de precios debe incluir las palabras price*',
        'warning'
      )
    }


    if((this.rule.ruleType === "PRICES" && this.rule.then.includes("price*"))){
      const numberToMultiply = this.rule.then.replace("price*", '')
      if (!Number.isInteger(numberToMultiply)) {
        return Swal.fire(
          'Espera',
          'Después de la palabra price*  debe aparecer un número, no se reconocio el número',
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
            'Uno de los valores (si) ya existe en otra regla para el mismo catálogo, edite esta regla siquiere cambiarla',
            'warning'
          )

        case "field exist with same then":
          return Swal.fire(
            'Espera',
            'La conclusión (then) ya existe en otra regla para el mismo catálogo, no es necesario crear una nueva editela',
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
      console.log("update action")
      
      this.store.dispatch(RulesActions.updateRule(
        {id:ruleData.id,data:ruleData}
      ))

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
          rule.selectedFields.map( field => {
            if(result.selectedFields.includes(field) && rule.id != result.id ){
              exist = "field exist on another rule"
            }
          })
        })

        const results2 = this.rules.filter( frule =>  frule.ruleType === rule.ruleType && 
          frule.then === rule.then && frule.supplier === rule.supplier && rule.id != frule.id  )

        console.log("results2",results2)

        if(results2.length > 0)
        {
          exist = "field exist with same then"
        }

      }
      
      if(rule.ruleType === "PRICES" || rule.ruleType === "COLOR")
      {
        const results2 = this.rules.filter( frule => frule => frule.ruleType === rule.ruleType && 
          frule.then === rule.then && frule.supplier === rule.supplier )

        if(results2.length > 0)
        {
          exist = "field exist with same then"
        }
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
                'Uno de los valores (si) ya existe en otra regla para el mismo catálogo, edite esta regla siquiere cambiarla',
                'warning'
              )

            case "field exist with same then":
              return Swal.fire(
                'Espera',
                'La conclusión (then) ya existe en otra regla para el mismo catálogo, no es necesario crear una nueva editela',
                'warning'
              )
          }
        }


      }
      
    }, (reason) => {
      console.log("reason",reason)
    });
  }


}
