/*
======================================
; Title: service-repair.component.spec.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 26 September 2023
; Last Updated: 26 September 2023
; Description: This code supports the Service Repair Component
; Sources Used: Bellevue University WEB-450 Coding Sessions
;=====================================
*/

// imports
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceRepairComponent } from './service-repair.component';

describe('ServiceRepairComponent', () => {
  let component: ServiceRepairComponent;
  let fixture: ComponentFixture<ServiceRepairComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceRepairComponent]
    });
    fixture = TestBed.createComponent(ServiceRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
