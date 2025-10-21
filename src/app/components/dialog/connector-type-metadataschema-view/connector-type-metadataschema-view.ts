import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-connector-type-metadataschema-view',
  standalone: false,
  templateUrl: './connector-type-metadataschema-view.html',
  styleUrl: './connector-type-metadataschema-view.scss'
})
export class ConnectorTypeMetadataschemaView {
constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConnectorTypeMetadataschemaView>
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
