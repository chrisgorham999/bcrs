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
