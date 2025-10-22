import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateList } from './template-list';

describe('TemplateList', () => {
  let component: TemplateList;
  let fixture: ComponentFixture<TemplateList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
