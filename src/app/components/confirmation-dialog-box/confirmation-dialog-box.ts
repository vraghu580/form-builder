import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirmation-dialog-box',
  standalone: false,
  templateUrl: './confirmation-dialog-box.html',
  styleUrl: './confirmation-dialog-box.scss'
})
export class ConfirmationDialogBox {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogBox>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
