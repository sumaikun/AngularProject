import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from "@ngrx/store"
import { SuppliersActions, RulesActions } from "../../store/actions"
import { selectAllEntities as selectAll} from "../../store/selectors/suppliers"
import { selectAllEntities , selectEntityLoaded, selectError } from "../../store/selectors/rules";
import Swal from 'sweetalert2' 


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

  suppliers$ = this.store.pipe(select(selectAll));

  rule:any

  buttonWasPressed: boolean

  suppliers: any[]

  isFormDisabled:boolean

  constructor(private modalService: NgbModal,
    private store: Store<any>) { }


    //selectedFields = [];
    shopifyFields = [
        { id: 'title', name: 'title' },
        { id: 'body_html', name: 'body_html' },
        { id: 'product_type', name: 'product_type' },
        { id: 'handle', name: 'handle' },
        { id: 'tags', name: 'tags' },
    ];

  ngOnInit(): void {

    this.store.dispatch(SuppliersActions.loadSuppliers());

    this.store.dispatch(RulesActions.loadRules());

    this.suppliers$.subscribe( data => {
      this.suppliers = data
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

    if(this.rule.ruleType === "GRAMMAR_CORRECTION" && !this.rule.operationType )
    {
      return Swal.fire(
        'Espera',
        'La corrección gramatical necesita un tipo de operación',
        'warning'
      )
    }

    if(this.rule.ruleType === "GRAMMAR_CORRECTION" && this.rule.operationType === "REPLACE" && ( !this.rule.if || !this.rule.then ) )
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

    if(this.rule.ruleType === "PRICES" && (  !this.rule.then ) )
    {
      return Swal.fire(
        'Espera',
        'Para validar precios debes tener todos los campos',
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

    this.saveRule(this.rule)
    

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

    this.loaded$.subscribe( loaded => {

      console.log("loaded",loaded,this.buttonWasPressed)

      if(loaded && this.buttonWasPressed ){

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

    this.modalService.dismissAll()

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
      similarity:rule.similarity
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
      similarity:rule.similarity
    }

    this.openModal()

    this.isFormDisabled = false
  }


}
