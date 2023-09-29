/*
======================================
; Title: invoice-list.component.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 27 September 2023
; Last Updated: 29 September 2023
; Description: This code supports the Graph Component
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

// imports
import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnInit {
  purchases: any;
  itemCount: string[] = [];
  labels: string[] = [];

  constructor(private invoiceService: InvoiceService) {
    this.purchases = [];
  }

  ngOnInit(): void {
    this.invoiceService.findPurchasesByServiceGraph().subscribe({
      next: (res) => {
        this.purchases = res;

        // Clear the previous data before populating again
        this.labels.length = 0;
        this.itemCount.length = 0;

        // Populate the data arrays
        for (let item of this.purchases) {
          let title = item._id.name;
          let count = item.count;

          this.labels.push(title);
          this.itemCount.push(count);
        }

        // Create the pie chart here, after the data is populated
        const myPie = new Chart('myPieChart', {
          type: 'pie',
          data: {
            labels: this.labels, //set from our db
            datasets: [
              {
                data: this.itemCount, //set from our db
                backgroundColor: [
                  '#ED0A3F',
                  '#FF8833',
                  '#5FA777',
                  '#0066CC',
                  '#6B3FA0',
                  '#AF593E',
                  '#6CDAE7',
                ],
                hoverBackgroundColor: [
                  '#ED0A3F',
                  '#FF8833',
                  '#5FA777',
                  '#0066CC',
                  '#6B3FA0',
                  '#AF593E',
                  '#6CDAE7',
                ],
              },
            ],
          },
        });
      },
    });
  }
}
