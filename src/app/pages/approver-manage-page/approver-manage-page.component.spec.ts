import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverManagePageComponent } from './approver-manage-page.component';

describe('ApproverManagePageComponent', () => {
  let component: ApproverManagePageComponent;
  let fixture: ComponentFixture<ApproverManagePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproverManagePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproverManagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
