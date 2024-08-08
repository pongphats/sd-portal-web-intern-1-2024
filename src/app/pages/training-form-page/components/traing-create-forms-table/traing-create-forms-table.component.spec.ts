import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraingCreateFormsTableComponent } from './traing-create-forms-table.component';

describe('TraingCreateFormsTableComponent', () => {
  let component: TraingCreateFormsTableComponent;
  let fixture: ComponentFixture<TraingCreateFormsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraingCreateFormsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraingCreateFormsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
