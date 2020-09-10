import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { ShopifyService } from '../../services/shopify.service'
import { RulesService } from '../../services/rules'
import { selectAllEntities } from "../../store/selectors/suppliers"
import { Store, select } from "@ngrx/store"
import { SuppliersActions } from "../../store/actions"
import { environment } from '../../../environments/environment'
import { PictureModalComponent } from '../../components/picture-modal/picture-modal.component'
import {Router} from "@angular/router"
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2' 

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  @ViewChild( PictureModalComponent ) pictureModal: PictureModalComponent ;

  @ViewChild('content') content:ElementRef;

  @ViewChild('content2') content2:ElementRef;

  originalProducts: any

  products:any

  entities$ = this.store.pipe(select(selectAllEntities));

  appENV:any

  supplierImage: string

  viewMode: string

  loading: boolean

  selectedProduct: any

  currentSupplier: any

  supplierRules: any

  idsChecked:Array<string>

  textToSearch: string

  page: number

  constructor(private shopifyService: ShopifyService,
    private rulesService: RulesService,
    private router: Router,private store: Store<any>,
    private modalService: NgbModal) { }

  ngOnInit(): void {

    this.page = 1

    this.loading = true

    this.appENV = environment

    this.shopifyService.getProducts().subscribe( products => {

        this.products = products.products

        //this.originalProducts = products.products

        this.loading = false

      },
      error => {
        console.log(error)
        return Swal.fire(
          'Espera',
          'Sucedio un error en el servidor',
          'error'
        )
      },    
    )

    this.store.dispatch(SuppliersActions.loadSuppliers());

    this.viewMode = "list"

    this.idsChecked = []
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

  getShopifyProductsByVendor(vendor:string,currentSupplier:any):void{

    if(this.loading === false)
    {
        this.idsChecked = []
        this.loading = true
        this.shopifyService.getCountByVendor(vendor).subscribe( count => {
          console.log("count",count)
        },error=>{
          this.loading = false
          return Swal.fire(
            'Espera',
            'Sucedio un error en el servidor',
            'error'
          )
        }) 
        this.shopifyService.getByVendor(vendor).subscribe( products => {
          this.products = products.products

          this.originalProducts = products.products

          this.loading = false

        }) 
        this.currentSupplier = currentSupplier
    }
    
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

  openRulesModal() {

    console.log(this.currentSupplier)

    if(!this.currentSupplier)
    {
      return Swal.fire(
        'Espera',
        'Pon el catalogo relacionado',
        'warning'
      )
    }

    this.rulesService.getBySupplier(this.currentSupplier.id).subscribe( data =>  this.supplierRules = data )

    this.modalService.open(this.content2, {ariaLabelledBy: 'modal-basic-title',size:'lg'}).result.then((result) => {
      console.log("result")
      if(this.idsChecked.length == 0)
      {
        return Swal.fire(
          'Espera',
          'Selecciona las reglas para probar',
          'warning'
        )
      }
      else{


        this.rulesService.testRules(  this.idsChecked, this.products.filter( product => !product.mode ) ).subscribe( 
          (data: Array<any>)  => 
            {
              console.log(data)
              this.products = data.sort(function (a, b) {
                if (a.id > b.id) {
                  return 1;
                }
                if (a.id < b.id) {
                  return -1;
                }
                // a must be equal to b
                return 0;
              })
            } 
          )
      }
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

  fullList(){
    //console.log(this.textToSearch)
    if(this.textToSearch)
    {
      return this.products.filter(  product => 
        product.title?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase()) ||
        product.body_html?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase()) ||
        product.vendor?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase()) ||
        product.product_type?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase()) ||
        product.handle?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase()) ||
        product.tags?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase())
      ).sort(function (a, b) {
        if (a.id > b.id) {
          return 1;
        }
        if (a.id < b.id) {
          return -1;
        }
        // a must be equal to b
        return 0;
      })  
    }
    return this.products.sort(function (a, b) {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      // a must be equal to b
      return 0;
    })
  }

  filteredByPure(){
    if(this.textToSearch)
    {
      return this.products.filter( product => !product.mode ).filter(  product => 
        product.title?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase()) ||
        product.body_html?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase()) ||
        product.vendor?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase()) ||
        product.product_type?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase()) ||
        product.handle?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase()) ||
        product.tags?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase())
      ).sort(function (a, b) {
        if (a.id > b.id) {
          return 1;
        }
        if (a.id < b.id) {
          return -1;
        }
        // a must be equal to b
        return 0;
      })  
    }
    return this.products.filter( product => !product.mode ).sort(function (a, b) {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      // a must be equal to b
      return 0;
    })   
  }

  filteredByTest(){
    if(this.textToSearch)
    {
      return this.products.filter( product => product.mode === "test" ).filter(  product => 
        product.title?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase()) ||
        product.body_html?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase()) ||
        product.vendor?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase()) ||
        product.product_type?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase()) ||
        product.handle?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase()) ||
        product.tags?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase())
      ).sort(function (a, b) {
        if (a.id > b.id) {
          return 1;
        }
        if (a.id < b.id) {
          return -1;
        }
        // a must be equal to b
        return 0;
      })  
    }
    return this.products.filter( product => product.mode === "test" ).sort(function (a, b) {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      // a must be equal to b
      return 0;
    })   
  }

  onTabChange(){

  }

  onSearchChange(text):void{
    //console.log(text)
    this.textToSearch = text

  }

  clickDirection(direction:String):void{

    let lastID

    this.loading = true
    
    //console.log("avaliableProducts",avaliableProducts,this.currentSupplier)

    if(direction == "next")
    {
      lastID = this.originalProducts[ this.originalProducts.length - 1 ].id
    }else{
      lastID = this.originalProducts[0].id
    }

    this.shopifyService.getByVendorDirection( this.currentSupplier.vendorId, lastID, direction ).subscribe( products => {
      
      this.products = products.products
      this.loading = false

    })
  }


}


/*.sort(function (a, b) {
        if (a.id > b.id) {
          return 1;
        }
        if (a.id < b.id) {
          return -1;
        }
        // a must be equal to b
        return 0;
      })
 */