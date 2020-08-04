import { Component, OnInit } from '@angular/core';
import { ShopifyService } from '../../services/shopify.service'
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {


  products:Array<any>


  constructor(private shopifyService: ShopifyService) { }

  ngOnInit(): void {

    this.shopifyService.getProducts().subscribe( products => this.products = products.products  ) 

  }

}
