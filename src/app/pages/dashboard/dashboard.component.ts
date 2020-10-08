import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";

import { StadisticsService } from "../../services/stadistics.service"

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public datasets: any;
  public data: any;
  public salesChart;
  public ordersChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;

  public cardLabels:any

  constructor( private stadisticsService:StadisticsService ) { }

  ngOnInit() {

    this.cardLabels = []

    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];


    var chartOrders = document.getElementById('chart-orders');

    parseOptions(Chart, chartOptions());

    var chartSales = document.getElementById('chart-sales');

    /*
    
    this.ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartExample2.options,
      data: chartExample2.data
    });
    
    this.salesChart = new Chart(chartSales, {
			type: 'line',
			options: chartExample1.options,
			data: chartExample1.data
    });

    */

   

    
    
    this.stadisticsService.getStadistics().subscribe( data =>{
      console.log("data",data)
      this.cardLabels = data.cardLabels

      this.ordersChart = new Chart(chartOrders, {
        type: 'bar',
        options: chartExample2.options,
        data: {
          labels: data.monthLabels,
          datasets: [
            {
              label: "Chronos",
              data: data.monthCounts
            }
          ]
        }
      });

      this.salesChart = new Chart(chartSales, {
        type: 'line',
        options: chartExample1.options,
        data: {
          labels: data.monthLabels,
          datasets: [{
            label: 'Chronos',
            data: data.monthCounts
          }]
        }
      });
    })

  }

  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

}
