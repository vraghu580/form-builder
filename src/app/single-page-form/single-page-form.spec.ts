import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePageForm } from './single-page-form';

describe('SinglePageForm', () => {
  let component: SinglePageForm;
  let fixture: ComponentFixture<SinglePageForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SinglePageForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglePageForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
