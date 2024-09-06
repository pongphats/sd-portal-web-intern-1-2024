import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginWelfarePageComponent } from './login-welfare-page.component';

describe('LoginWelfarePageComponent', () => {
  let component: LoginWelfarePageComponent;
  let fixture: ComponentFixture<LoginWelfarePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginWelfarePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginWelfarePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
