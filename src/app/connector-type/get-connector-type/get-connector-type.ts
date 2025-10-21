import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { connectionTypeService } from '../../services/connection-type-service';
import { finalize } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Dialog } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogBox } from '../../components/confirmation-dialog-box/confirmation-dialog-box';
import { ConnectorTypeMetadataschemaView } from '../../components/dialog/connector-type-metadataschema-view/connector-type-metadataschema-view';

export interface ConnectorType {
  id: string;
  name: string;
  displayName: string;
  category: string;
  description?: string;
  connector_type?: string;
  metadataSchema?: Array<{
    key: string;
    label: string;
    type: string;
    required: boolean;
  }>;
}

@Component({
  selector: 'app-get-connector-type',
  standalone: false,
  templateUrl: './get-connector-type.html',
  styleUrls: ['./get-connector-type.scss']
})
export class GetConnectorType implements OnInit {
  connectionForm!: FormGroup;
  displayedColumns: string[] = ['index', 'name', 'displayName', 'category', 'metadata', 'actions'];
  dataSource = new MatTableDataSource<ConnectorType>();
  connectors: ConnectorType[] = [];
  showCreateForm = false;
  editId: string | number | null = null;
  isViewing = false;
  selectedConnector: ConnectorType | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  constructor(private fb: FormBuilder, private connectionService: connectionTypeService, private dialog: MatDialog) {
    this.connectionForm = this.fb.group({
      name: ['', Validators.required],
      displayName: ['', Validators.required],
      category: ['', Validators.required],
      // connector_type: [''],
      metadataSchema: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadConnectors();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  searchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewMetadata(metadata: any[]): void {
  this.dialog.open(ConnectorTypeMetadataschemaView, {
    width: '500px',
    data: { metadata },
  });
}

  get metadataSchema(): FormArray {
    return this.connectionForm.get('metadataSchema') as FormArray;
  }

  addMetadataField(): void {
    const fieldGroup = this.fb.group({
      key: ['', Validators.required],
      label: ['', Validators.required],
      required: [false],
      type: ['', Validators.required]
    });
    this.metadataSchema.push(fieldGroup);
  }

  removeMetadataField(index: number): void {
    this.metadataSchema.removeAt(index);
  }

  loadConnectors(): void {
    this.connectionService.getAll().subscribe({
      next: (data: ConnectorType[]) => {
        this.connectors = data;
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }


  onCreate(): void {
    this.showCreateForm = true;
    this.editId = null;
    this.connectionForm.reset();
    this.metadataSchema.clear();
  }

  /** ✅ Cancel create/edit */
  cancelCreate(): void {
    this.showCreateForm = false;
    this.editId = null;
    this.connectionForm.reset();
  }

  createConnectorType(): void {
    if (this.connectionForm.invalid) return;

    const newConnector = this.connectionForm.value;

    this.connectionService.createConnectionType(newConnector).subscribe({
      next: (res: any) => {
        console.log('✅ Connector created successfully:', res);
        this.connectors.push(res);
        this.cancelCreate();
        this.loadConnectors();
      },
      error: (err) => {
        console.error('❌ Error creating connector:', err);
        alert('Failed to create connector.');
      }
    });
  }

  //    createConnectorType(): void {
  //   if (this.connectionForm.invalid) {
  //     alert("Invalid Form");
  //     return;
  //   }

  //   const dialogRef = this.dialog.open(ConfirmationDialogBox, {
  //     width: '400px',
  //     data: {
  //       title: 'Save Connector',
  //       message: `Are you sure you want to save this new connector?`,
  //       confirmText: 'Save',
  //       cancelText: 'Cancel',
  //     },
  //   });

  //   dialogRef.afterClosed().subscribe((result: boolean) => {
  //     if (result) {
  //       const newConnector = this.connectionForm.value;

  //       this.connectionService.createConnectionType(newConnector).subscribe({
  //         next: (res: any) => {
  //           console.log('✅ Connector created successfully:', res);
  //           this.connectors.push(res);
  //           this.cancelCreate();
  //           this.loadConnectors();
  //           alert('Connector saved successfully!');
  //         },
  //         error: (err) => {
  //           console.error('❌ Error creating connector:', err);
  //           alert('Failed to create connector.');
  //         }
  //       });
  //     } else {
  //       console.log('Save cancelled');
  //     }
  //   });
  // }


  updateConnectorType(id: any): void {
    if (this.connectionForm.invalid) {
      alert("Invalid Form");
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogBox, {
      width: '400px',
      data: {
        title: 'Update Connector',
        message: `Are you sure you want to update this connector with ID "${id}"?`,
        confirmText: 'Update',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const updatedConnector = this.connectionForm.value;

        this.connectionService.update(id, updatedConnector).subscribe({
          next: (res: any) => {
            console.log('✅ Connector updated successfully:', res);

            const index = this.connectors.findIndex(c => c.id === id);
            if (index > -1) this.connectors[index] = res;

            this.cancelCreate();
            this.loadConnectors();

          },
          error: (err) => {
            console.error('❌ Error updating connector:', err);
          }
        });
      } else {
        console.log('Update cancelled');
      }
    });
  }


  onEdit(conn: ConnectorType): void {
    this.showCreateForm = true;
    this.editId = conn.id || null;
    console.log(this.editId);
    this.connectionForm.patchValue({
      name: conn.name,
      displayName: conn.displayName,
      category: conn.category,
      connector_type: conn.connector_type
    });

    this.metadataSchema.clear();
    if (conn.metadataSchema && Array.isArray(conn.metadataSchema)) {
      conn.metadataSchema.forEach((field: any) => {
        this.metadataSchema.push(
          this.fb.group({
            key: [field.key],
            label: [field.label],
            required: [field.required],
            type: [field.type]
          })
        );
      });
    }
  }

  onDelete(conn: ConnectorType): void {
    const dialogRef = this.dialog.open(ConfirmationDialogBox, {
      width: '400px',
      data: {
        title: 'Delete Connector',
        message: `Are you sure you want to delete the connector "${conn.name}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.connectionService.deleteConnectionType(conn.id).subscribe({
          next: () => {
            this.connectors = this.connectors.filter(c => c.id !== conn.id);
            this.dataSource.data = this.connectors;
          },
          error: (err) => {
            console.error('❌ Error deleting connector:', err);
          }
        });
      } else {
        console.log('Deletion cancelled');
      }
    });
  }


  onView(conn: ConnectorType): void {
    this.selectedConnector = conn;
    this.isViewing = true;
  }

  closeView(): void {
    this.isViewing = false;
    this.selectedConnector = null;
  }

  metadataSummary(conn: ConnectorType): string {
    return conn.metadataSchema
      ? conn.metadataSchema.map((m: any) => `${m.key}:${m.type}`).join(', ')
      : '—';
  }
}