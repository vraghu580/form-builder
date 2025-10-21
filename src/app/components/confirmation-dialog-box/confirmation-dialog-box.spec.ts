import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDialogBox } from './confirmation-dialog-box';

describe('ConfirmationDialogBox', () => {
  let component: ConfirmationDialogBox;
  let fixture: ComponentFixture<ConfirmationDialogBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmationDialogBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
