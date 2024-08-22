import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementUserPageComponent } from './management-user-page.component';

describe('ManagementUserPageComponent', () => {
  let component: ManagementUserPageComponent;
  let fixture: ComponentFixture<ManagementUserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementUserPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
