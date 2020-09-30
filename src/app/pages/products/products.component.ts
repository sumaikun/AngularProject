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

  rowsChecked:Array<string>

  textToSearch: string

  textToSearch2: string

  rowsPerPage:number;

  page:number;

  currentVendor:string;

  tabMode:string;

  copyProducts: string;

  constructor(private shopifyService: ShopifyService,
    private rulesService: RulesService,
    private router: Router,private store: Store<any>,
    private modalService: NgbModal) { }

  ngOnInit(): void {

    this.page = 1

    this.loading = true

    this.appENV = environment

    this.rowsPerPage = 125
    this.page = 0

    this.products = []

    this.shopifyService.getProducts().subscribe( products => {

        this.products = products.products

        //console.log("this.products",this.products)

        //this.originalProducts = products.products

        this.copyProducts = JSON.stringify(products.products)

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

    this.currentVendor = ""

    this.tabMode = "combinedList"

    this.textToSearch2 = ""

    this.rowsChecked = ["Title","body_html","vendor","product_type","handle","tags"]
  }

  ShowPicture(photoUrl):void{
      
    this.supplierImage = photoUrl ? this.appENV.imagesUrl+photoUrl : this.appENV.defaultImage

    this.pictureModal.open()
  }

  ShowPictureByUrl(url):void{
    this.supplierImage = url ? url : this.appENV.defaultImage

    this.pictureModal.open()
  }


  onCheckChange(mode,checked):void{
    
    this.viewMode = mode

  }

  getShopifyProductsByVendor(vendor:string,currentSupplier:any):void{

    /*if(this.loading === false)
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
        
    }*/

    this.currentSupplier = currentSupplier

    this.currentVendor = vendor
    
  }

  openCell(event){
    //console.log("dbl click",event.target,event.target.style.whiteSpace)
    if(event.target.style.whiteSpace.length == 0 || event.target.style.whiteSpace == "nowrap")
    {
      event.target.style.whiteSpace = "break-spaces"
    }else{
      event.target.style.whiteSpace = "nowrap"
    }
  }

  watchVariants(product){
    //console.log("product",product)
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

        console.log("this.products.filter( product => !product.mode && product.supplier ===  this.currentSupplier.id)",
        this.products.filter( product => !product.mode && product.vendor === this.currentSupplier.vendorId  ))

        this.rulesService.testRules(  this.idsChecked, this.products.filter( product => !product.mode 
          && product.vendor ===  this.currentSupplier.vendorId ) ).subscribe( 
          (data: Array<any>)  => 
            {
              Swal.fire('',"Reglas simuladas",'success')
              console.log(data)
              data.map(
                subdata => {
                  const index =  this.products.findIndex( element => element.id === subdata.id )
                  if(index != -1)
                  {
                       this.products[index] = { ...this.products[index] , ...subdata}
                  }
                  else{
                      //console.log("data",data)
                       this.products.push(subdata)
                  }
                }
              )
            }, error =>  Swal.fire('Espera',"sucedio un error en la simulación de datos",'error')
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

  onCheckChange3(row,checked):void{
    //console.log(row,checked)

    if(checked)
    {
      this.rowsChecked.push(row)
    }else{
      const index = this.rowsChecked.indexOf(row);
      if (index > -1) {
        this.rowsChecked.splice(index, 1);
        console.log("this.rowsChecked",this.rowsChecked)
      }
    }

  }

  isRowChecked(id):boolean{
    //console.log("this.rowsChecked.includes(id)",this.rowsChecked.includes(id))
    return this.rowsChecked.includes(id)
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
        product.tags?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase()) ||
        product.id?.toString().includes(this.textToSearch) ||
        product.originalId?.toString().includes(this.textToSearch)
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
    }).filter(
      row => {
        if(this.currentVendor.length > 0)
        {
          //console.log("this.currentVendor",this.currentVendor)
          return row.vendor === this.currentVendor
        }

        return true
      }
    )
  }

  fullListWithPagination(){
    const data = this.fullList()
    return data.slice(this.page * this.rowsPerPage, this.page * this.rowsPerPage + this.rowsPerPage)
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
        product.tags?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase()) ||
        product.id?.toString().includes(this.textToSearch)
      ).sort(function (a, b) {
        if (a.id > b.id) {
          return 1;
        }
        if (a.id < b.id) {
          return -1;
        }
        // a must be equal to b
        return 0;
      }).filter(
        row => {
          if(this.currentVendor.length > 0)
          {
            //console.log("this.currentVendor",this.currentVendor)
            return row.vendor === this.currentVendor
          }
  
          return true
        }
      )
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
    }).filter(
      row => {
        if(this.currentVendor.length > 0)
        {
          //console.log("this.currentVendor",this.currentVendor)
          return row.vendor === this.currentVendor
        }

        return true
      }
    )   
  }

  filteredByPureWithPagination(){
    const data = this.filteredByPure()
    return data.slice(this.page * this.rowsPerPage, this.page * this.rowsPerPage + this.rowsPerPage)
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
        product.tags?.toLowerCase().includes(this.textToSearch.toLocaleLowerCase()) ||
        product.originalId?.toString().includes(this.textToSearch)
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

  filteredByTestWithPagination(){
    const data = this.filteredByTest()
    return data.slice(this.page * this.rowsPerPage, this.page * this.rowsPerPage + this.rowsPerPage) 
  }

  onTabChange(){

  }

  onSearchChange(text):void{
    //console.log(text)
    this.textToSearch = text

  }

  onSearchChange2(text):void{
    //console.log(text)
    this.textToSearch2 = text

  }

  onPageChange(page:number):void {
    console.log("page to change",page)
    this.page = page
  }

  checkTabType(tabMode:string):void{
    console.log("checkTabType")
    this.tabMode = tabMode
  }

  footerData(){
    switch(this.tabMode){
      case "combinedList":
        return this.fullList()
      case "pureList":
        return this.filteredByPure()
      case "testList":
        return this.filteredByTest()
      default:
        return []
      

    }
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

  getSupplierRules(){
    if(this.textToSearch2.length > 0)
    {
      return this.supplierRules.filter( element =>  {
        const ruleTypeName = this.getRuleTypeName(element.ruleType)    
        
        console.log("ruleTypeName",ruleTypeName,"element",element)
        
        return  ruleTypeName?.toLocaleLowerCase().includes(this.textToSearch2.toLocaleLowerCase())
        || element.operationType?.toLocaleLowerCase().includes(this.textToSearch2.toLocaleLowerCase())
        || element.if?.toLocaleLowerCase().includes(this.textToSearch2.toLocaleLowerCase())
        || element.then?.toLocaleLowerCase().includes(this.textToSearch2.toLocaleLowerCase())
      })
    }
    return this.supplierRules
  }

  removeVendorFilter(){
    this.currentVendor = ""
    this.currentSupplier = null
    this.products = JSON.parse(this.copyProducts)
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