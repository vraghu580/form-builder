import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePreviewDialog } from './template-preview-dialog';

describe('TemplatePreviewDialog', () => {
  let component: TemplatePreviewDialog;
  let fixture: ComponentFixture<TemplatePreviewDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplatePreviewDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplatePreviewDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
