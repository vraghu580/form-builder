import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetConnectorType } from './get-connector-type';

describe('GetConnectorType', () => {
  let component: GetConnectorType;
  let fixture: ComponentFixture<GetConnectorType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GetConnectorType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetConnectorType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
