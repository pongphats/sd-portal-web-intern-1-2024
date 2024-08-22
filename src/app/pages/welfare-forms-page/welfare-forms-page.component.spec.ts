import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelfareFormsPageComponent } from './welfare-forms-page.component';

describe('WelfareFormsPageComponent', () => {
  let component: WelfareFormsPageComponent;
  let fixture: ComponentFixture<WelfareFormsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelfareFormsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelfareFormsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
