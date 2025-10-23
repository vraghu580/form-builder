import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectForm } from './connect-form';

describe('ConnectForm', () => {
  let component: ConnectForm;
  let fixture: ComponentFixture<ConnectForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
