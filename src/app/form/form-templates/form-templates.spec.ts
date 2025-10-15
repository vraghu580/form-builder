import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTemplates } from './form-templates';

describe('FormTemplates', () => {
  let component: FormTemplates;
  let fixture: ComponentFixture<FormTemplates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormTemplates]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTemplates);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
