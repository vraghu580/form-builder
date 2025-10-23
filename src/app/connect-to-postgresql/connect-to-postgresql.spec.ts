import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectToPostgresql } from './connect-to-postgresql';

describe('ConnectToPostgresql', () => {
  let component: ConnectToPostgresql;
  let fixture: ComponentFixture<ConnectToPostgresql>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectToPostgresql]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectToPostgresql);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
