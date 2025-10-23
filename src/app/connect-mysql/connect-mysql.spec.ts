import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectMysql } from './connect-mysql';

describe('ConnectMysql', () => {
  let component: ConnectMysql;
  let fixture: ComponentFixture<ConnectMysql>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectMysql]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectMysql);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
