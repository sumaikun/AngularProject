import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  collapse:boolean

  constructor() { }

  ngOnInit() {

  }

  onCollapseMenu(collapse:boolean):void {

    //console.log("collapse state",collapse)

    //const menu = document.querySelector("#sidenav-main") as HTMLCollectionOf<HTMLElement>;
    
    //console.log("menu",menu)

    if(collapse){
       document.querySelector("#sidenav-main")["style"].width="50px"
       document.querySelector("#content-app")["style"].marginLeft="50px"
       document.querySelector(".navbar-heading.text-muted")["style"].display="none"
       document.querySelector("#close_indicator")["style"].display="none"
    }else{
       document.querySelector("#sidenav-main")["style"].width="250px"
       document.querySelector("#content-app")["style"].marginLeft="250px"
       document.querySelector(".navbar-heading.text-muted")["style"].display="block"
       document.querySelector("#close_indicator")["style"].display="block"
    }

  }

}
