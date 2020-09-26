import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { ShopifyService } from '../../services/shopify.service'
import { ProductTraceService } from '../../services/product-trace'
import { environment } from '../../../environments/environment'
import { PictureModalComponent } from '../../components/picture-modal/picture-modal.component'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2' 
import * as moment from 'moment'


@Component({
  selector: 'app-products-updated',
  templateUrl: './productsUpdated.component.html',
  styleUrls: ['./productsUpdated.component.scss']
})
export class ProductsUpdatesComponent implements OnInit {

  @ViewChild( PictureModalComponent ) pictureModal: PictureModalComponent ;

  @ViewChild('content') content:ElementRef;

  @ViewChild('content2') content2:ElementRef;

  appENV:any

  supplierImage: string

  rowsPerPage:number;

  page:number;

  loading:boolean

  filter:any;

  data:any;

  selectedProduct:any
  
  constructor(private modalService: NgbModal,
    private shopifyService: ShopifyService,
    private productTraceService: ProductTraceService) { }

  ngOnInit(): void {
    this.appENV = environment
    this.loading = false
    this.filter = {
      fromDate:null,
      toDate:null
    }
  }

  ShowPictureByUrl(url):void{
    this.supplierImage = url ? url : this.appENV.defaultImage
    this.pictureModal.open()
    
  }

  onPageChange(page:number):void {
    console.log("page to change",page)
    this.page = page
  } 

  filterByDates() {
    console.log(this.filter.fromDate,this.filter.toDate)
    if(this.filter.fromDate === null || this.filter.toDate === null)
    {
      Swal.fire('Espera','debes llenar los datos de los filtros para continuar','question')
      return
    }

    //console.log(moment(this.filter.fromDate).diff(moment(this.filter.toDate)))
    if(moment(this.filter.fromDate).diff(moment(this.filter.toDate)) > 0)
    {
      Swal.fire('Espera','la fecha final no puede ser menor que la inicial','question')
      return
    }

    this.productTraceService.findBetweenDates(this.filter.fromDate, this.filter.toDate).subscribe( data =>{
        console.log("data",data)
        this.data = data 
    })

  }

  openCell(event){
    console.log("dbl click",event.target,event.target.style.whiteSpace)
    if(event.target.style.whiteSpace.length == 0 || event.target.style.whiteSpace == "nowrap")
    {
      event.target.style.whiteSpace = "break-spaces"
    }else{
      event.target.style.whiteSpace = "nowrap"
    }
  }

  watchVariants(product){
    console.log("product",product)
    this.openVariantsModal()
    this.selectedProduct = product
  }


  openVariantsModal() {
    this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title',size:'lg'}).result.then((result) => {
      
    }, (reason) => {
      
    });
  }


}