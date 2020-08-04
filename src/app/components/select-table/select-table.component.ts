import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from "@ngrx/store";
import { selectAllEntities  as selectSuppliers } from "../../store/selectors/suppliers";
import { SuppliersActions } from "../../store/actions";
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-select-table',
  templateUrl: './select-table.component.html',
  styleUrls: ['./select-table.component.scss']
})
export class SelectTableComponent implements OnInit {

  @ViewChild('content') content:ElementRef;

  @Input('headers') headers: Array<any>;

  @Input('mode') mode: string;

  @Output() idsSelectedEvent = new EventEmitter<Array<string>>();

  entities:Array<any>

  appENV:any

  idsChecked:Array<string>

  ngOnInit(): void {

    this.idsChecked =  []

    console.log("mode",this.mode,this.headers)

    if(this.mode === "suppliers")
    {
      this.store.dispatch(SuppliersActions.loadSuppliers());

      this.store.pipe(select(selectSuppliers)).subscribe( data => {
        //console.log("suppliers",data)
        this.entities = data
      })
    }

  }

  closeResult = '';

  constructor(private modalService: NgbModal,private store: Store<any>) {
    this.appENV = environment
  }

  open() {
   
    console.log("this.idsChecked",this.idsChecked)
    this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title',size:'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      //console.log(this.closeResult,this.idsChecked)
      this.idsSelectedEvent.emit(this.idsChecked)
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      //console.log(this.closeResult)
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onCheckChange(entity,checked):void{
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

}
