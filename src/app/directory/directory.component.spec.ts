/*
======================================
; Title: directory.component.spec.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 22 September 2023
; Last Updated: 22 September 2023
; Description: This code supports the Directory Component
; Sources Used: Bellevue University WEB-450 GitHub Repository
;=====================================
*/

// imports
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectoryComponent } from './directory.component';

describe('DirectoryComponent', () => {
  let component: DirectoryComponent;
  let fixture: ComponentFixture<DirectoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirectoryComponent],
    });
    fixture = TestBed.createComponent(DirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
