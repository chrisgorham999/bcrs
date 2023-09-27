/*
======================================
; Title: verify-security-questions.component.spec.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 20 September 2023
; Last Updated: 21 September 2023
; Description: This code supports the Verify Security Questions Component
; Sources Used: Bellevue University WEB-450 Coding Sessions
;=====================================
*/

// imports
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifySecurityQuestionsComponent } from './verify-security-questions.component';

describe('VerifySecurityQuestionsComponent', () => {
  let component: VerifySecurityQuestionsComponent;
  let fixture: ComponentFixture<VerifySecurityQuestionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerifySecurityQuestionsComponent]
    });
    fixture = TestBed.createComponent(VerifySecurityQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
