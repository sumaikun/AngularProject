import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';



@Component({
  selector: 'table-footer',
  templateUrl: './table-footer.component.html',
  styleUrls: ['./table-footer.component.scss']
})


export class TableFooterComponent implements OnInit { 

  @Input() entities: Array<any>;
  @Input('rowsPerPage') rowsPerPage: number;

  @Output() pageChanged = new EventEmitter<number>();

  totalPages: number;
  currentPage: number;

  constructor() { }

  ngOnInit() {
    console.log(this.entities,this.rowsPerPage,Math.ceil(this.entities.length/this.rowsPerPage) )
    this.totalPages = Math.ceil(this.entities.length/this.rowsPerPage)
    this.currentPage = 1
  }

  changePage(page):void{
    this.pageChanged.emit(page -1);
    this.currentPage = page
  }

  goBack():void{

    if(this.currentPage != 1)
    {
      const page = this.currentPage - 1
      this.pageChanged.emit(page-1)
      this.currentPage = page
    }

  }

  goForward():void{

    if(this.currentPage < this.totalPages)
    {
      const page = this.currentPage + 1
      this.pageChanged.emit(page-1)
      this.currentPage = page
    }

  }

}
