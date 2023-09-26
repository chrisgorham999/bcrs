import { Component } from '@angular/core';

@Component({
  selector: 'app-service-repair',
  templateUrl: './service-repair.component.html',
  styleUrls: ['./service-repair.component.css']
})
export class ServiceRepairComponent {
  services: Service[] = [
    { name: 'Service A', cost: 10.0, selected: false },
    { name: 'Service B', cost: 20.0, selected: false },
    { name: 'Service C', cost: 30.0, selected: false }
  ];

  totalCost: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  calculateTotal(): void {
    this.totalCost = this.services
      .filter(service => service.selected)
      .reduce((total, service) => total + service.cost, 0);
  }
}

interface Service {
  name: string;
  cost: number;
  selected: boolean;
}
