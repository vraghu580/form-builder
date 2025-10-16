import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectManageSource } from './connect-manage-source';

describe('ConnectManageSource', () => {
  let component: ConnectManageSource;
  let fixture: ComponentFixture<ConnectManageSource>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectManageSource]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectManageSource);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
