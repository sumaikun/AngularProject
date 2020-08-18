import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { ShopifyService } from '../../services/shopify.service'
import { selectAllEntities } from "../../store/selectors/suppliers"
import { Store, select } from "@ngrx/store"
import { SuppliersActions } from "../../store/actions"
import { environment } from '../../../environments/environment'
import { PictureModalComponent } from '../../components/picture-modal/picture-modal.component'
import {Router} from "@angular/router"
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  @ViewChild( PictureModalComponent ) pictureModal: PictureModalComponent ;

  @ViewChild('content') content:ElementRef;

  products:Array<any>

  entities$ = this.store.pipe(select(selectAllEntities));

  appENV:any

  supplierImage: string

  viewMode: string

  loading: boolean

  selectedProduct: any

  constructor(private shopifyService: ShopifyService,
    private router: Router,private store: Store<any>,
    private modalService: NgbModal) { }

  ngOnInit(): void {

    this.loading = true

    this.appENV = environment

    this.shopifyService.getProducts().subscribe( products => {
      this.products = products.products
      this.loading = false
    }) 

    this.store.dispatch(SuppliersActions.loadSuppliers());

    this.viewMode = "list"
  }

  ShowPicture(photoUrl):void{
      
    this.supplierImage = photoUrl ? this.appENV.imagesUrl+photoUrl : this.appENV.defaultImage

    this.pictureModal.open()
  }

  ShowPictureByUrl(url):void{
    this.supplierImage = url ? url : this.appENV.defaultImage

    this.pictureModal.open()
  }

  createSupplier(): void {
    console.log("createSupplier")
    this.router.navigate(['supplier-form'])
  }

  onCheckChange(mode,checked):void{
    
    this.viewMode = mode

  }

  getShopifyProductsByVendor(vendor:string):void{
    this.loading = true
    this.shopifyService.getByVendor(vendor).subscribe( products => {
      this.products = products.products
      this.loading = false
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
