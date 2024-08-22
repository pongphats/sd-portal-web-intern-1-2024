import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetWellfareManagePageComponent } from './budget-wellfare-manage-page.component';

describe('BudgetWellfareManagePageComponent', () => {
  let component: BudgetWellfareManagePageComponent;
  let fixture: ComponentFixture<BudgetWellfareManagePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetWellfareManagePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetWellfareManagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
