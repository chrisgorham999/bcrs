import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-service-repair',
  templateUrl: './service-repair.component.html',
  styleUrls: ['./service-repair.component.css']
})
export class ServiceRepairComponent  {

  services = [
    {title: 'Password Reset', price: 39.99, id: '101'},
    {title: 'Spyware Removal', price: 99.9, id: '102'},
    {title: 'RAM Upgrade', price: 129.99, id: '103'},
    {title: 'Software Installation', price: 49.99, id: '104'},
    {title: 'PC Tune-up', price: 89.99, id: '105'},
    {title: 'Keyboard Cleaning', price: 45.00, id: '106'},
    {title: 'Disk Clean-up', price: 149.99, id: '107'}
  ];


}