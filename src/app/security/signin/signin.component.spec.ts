/*
======================================
; Title: signin.component.spec.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 13 September 2023
; Last Updated: 13 September 2023
; Description: This code supports the Sign In Component
; Sources Used: N/A
;=====================================
*/

// imports
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SigninComponent } from './signin.component';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SigninComponent]
    });
    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
