import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorForm } from './connector-form';

describe('ConnectorForm', () => {
  let component: ConnectorForm;
  let fixture: ComponentFixture<ConnectorForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectorForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectorForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
