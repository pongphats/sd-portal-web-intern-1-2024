import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginTrainingFormsComponent } from './login-training-forms.component';

describe('LoginTrainingFormsComponent', () => {
  let component: LoginTrainingFormsComponent;
  let fixture: ComponentFixture<LoginTrainingFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginTrainingFormsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginTrainingFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
