import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelfareExpenseHistoryComponent } from './welfare-expense-history.component';

describe('WelfareExpenseHistoryComponent', () => {
  let component: WelfareExpenseHistoryComponent;
  let fixture: ComponentFixture<WelfareExpenseHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelfareExpenseHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelfareExpenseHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
