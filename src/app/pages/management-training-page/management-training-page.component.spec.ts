import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementTrainingPageComponent } from './management-training-page.component';

describe('ManagementTrainingPageComponent', () => {
  let component: ManagementTrainingPageComponent;
  let fixture: ComponentFixture<ManagementTrainingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementTrainingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementTrainingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
