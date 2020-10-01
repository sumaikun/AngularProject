import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core'
import { ShopifyService } from '../../services/shopify.service'
import { ProductTraceService } from '../../services/product-trace'
import { environment } from '../../../environments/environment'
import { PictureModalComponent } from '../../components/picture-modal/picture-modal.component'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2' 
import * as moment from 'moment'
import { SearchService } from "../../services/search.service"
import { Subscription } from 'rxjs'


@Component({
  selector: 'app-products-updated',
  templateUrl: './productsUpdated.component.html',
  styleUrls: ['./productsUpdated.component.scss']
})
export class ProductsUpdatesComponent implements OnInit, OnDestroy {

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

  copyData:any;

  selectedProduct:any

  idsChecked:Array<string>

  subscription: Subscription;
  
  
  constructor(private modalService: NgbModal,
    private searchService: SearchService,
    private shopifyService: ShopifyService,
    private productTraceService: ProductTraceService) {
      searchService.clear()

      this.subscription = searchService.textToSearch$.subscribe( text => {

        if(text.length > 0 && this.data)
        {
          //this.data = []

          const textToSearch = text.toLocaleLowerCase()

          console.log("textToSearch",textToSearch)
          
          

          this.data = this.copyData.filter( subdata => 
            subdata.chronos?.title?.toLocaleLowerCase().includes(textToSearch) ||
            subdata.shopifyProduct.product.title?.toLowerCase().includes(textToSearch) ||
            subdata.shopifyProduct.product.body_html?.toLowerCase().includes(textToSearch) ||
            subdata.shopifyProduct.product.vendor?.toLowerCase().includes(textToSearch) ||
            subdata.shopifyProduct.product.product_type?.toLowerCase().includes(textToSearch) ||
            subdata.shopifyProduct.product.handle?.toLowerCase().includes(textToSearch) ||
            subdata.shopifyProduct.product.tags?.toLowerCase().includes(textToSearch) ||
            this.filterOnVariants(subdata.shopifyProduct.product,textToSearch)
          ) 
       
        }
       
    })    
  }

  filterOnVariants(product,textToSearch){
    let isOnVariant = false
    product.variants.map( variant => {
      if( variant.id?.toString().includes(textToSearch) ||
          variant.title?.toLowerCase().includes(textToSearch.toLocaleLowerCase()) ||
          variant.option1?.toLowerCase().includes(textToSearch.toLocaleLowerCase()) ||
          variant.sku?.toLowerCase().includes(textToSearch.toLocaleLowerCase()) ||
          variant.price?.toString().includes(textToSearch.toLocaleLowerCase()))
        {
          isOnVariant = true
        }
      }       
    )

    return isOnVariant
  }

  ngOnInit(): void {
    this.rowsPerPage = 150
    this.page = 0
    this.appENV = environment
    this.loading = false
    this.filter = {
      fromDate:null,
      toDate:null
    }
    this.idsChecked = []
    this.data = []
    
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
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
    this.loading = true
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
        this.copyData = JSON.parse(JSON.stringify(data))
        this.loading = false
    },err => Swal.fire("Sucedio un error","No se pudo conectar con el servidor","error")  )

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

  recoverVersion(product){

    Swal.fire({
      title: '¿Esta seguro?',
      text: "Esto modificara la información en la tienda",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, adelante!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.shopifyService.updateProductOnShopify(product.id,{product:product}).subscribe( 
          result => Swal.fire("Ok","Datos actualizados","success"),
          error =>  Swal.fire("Sucedio un error","No se pudo regresar a esta versión","error")
        )
            
      }
    })
    
  }


  openVariantsModal() {
    this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title',size:'lg'}).result.then((result) => {
      
    }, (reason) => {
      
    });
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

  selectAll(){
    this.idsChecked = []
    this.data.map( subdata => this.idsChecked.push(subdata.id) )
  }

  returnInBatch(){
    if(this.loading == false)
    {
      this.loading = true
      const self = this
      this.shopifyService.shopifyProductWithBatch(this.idsChecked).subscribe(  result =>{
        if(this.idsChecked.length > 250)
        {
          Swal.fire("Ok","Los datos se enviaron a una cola","success").then( data => self.loading = false )
        }else{
          Swal.fire("Ok","Datos actualizados","success").then( data => self.loading = false )
        }
        
      },
      error =>  Swal.fire("Sucedio un error","No todos los productos pudieron regresar a esta versión","error").then( data => self.loading = false ) )
    }
    
  }

}