import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Generic9FormComponent } from './generic9-form.component';

describe('Generic9FormComponent', () => {
  let component: Generic9FormComponent;
  let fixture: ComponentFixture<Generic9FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Generic9FormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Generic9FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
