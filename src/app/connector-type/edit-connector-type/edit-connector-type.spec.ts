import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConnectorType } from './edit-connector-type';

describe('EditConnectorType', () => {
  let component: EditConnectorType;
  let fixture: ComponentFixture<EditConnectorType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditConnectorType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditConnectorType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
