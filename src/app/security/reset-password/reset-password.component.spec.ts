/*
======================================
; Title: reset-password.component.spec.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 20 September 2023
; Last Updated: 21 September 2023
; Description: This code supports the Reset Password Component
; Sources Used: Bellevue University WEB-450 Coding Sessions
;=====================================
*/

// imports
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent]
    });
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
