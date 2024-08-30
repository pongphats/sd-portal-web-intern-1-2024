import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionTwoFormComponent } from './section-two-form.component';

describe('SectionTwoFormComponent', () => {
  let component: SectionTwoFormComponent;
  let fixture: ComponentFixture<SectionTwoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionTwoFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionTwoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
