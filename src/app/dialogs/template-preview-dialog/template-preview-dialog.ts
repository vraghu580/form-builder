import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-template-preview-dialog',
  standalone: false,
  templateUrl: './template-preview-dialog.html',
  styleUrl: './template-preview-dialog.scss'
})
export class TemplatePreviewDialog {
constructor(
    public dialogRef: MatDialogRef<TemplatePreviewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
