import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { connectionTypeService } from '../../services/connection-type-service';

// ✅ Define the interface for connector type
export interface ConnectorType {
  id: string;
  name: string;
  displayName: string;
  category: string;
  description?: string;
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
  connectors: ConnectorType[] = [];
  loading = false;
  error = '';

  // For modal view
  selectedConnector: ConnectorType | null = null;
  isViewing = false;

  // Track deleting state per item id
  deletingMap: Record<string, boolean> = {};

  constructor(
    private svc: connectionTypeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadList();
  }

  /** 🔹 Load all connector types */
  loadList() {
    this.loading = true;
    this.error = '';

    this.svc.getAll()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.connectors = data || [];
        },
        error: (err) => {
          console.error('Failed to load connectors', err);
          this.error = err?.message || 'Failed to load connector types';
        }
      });
  }

  /** 🔹 Navigate to create page */
  onCreate() {
    this.router.navigate(['/connector-types/create']);
  }

  /** 🔹 Navigate to edit page */
  onEdit(conn: ConnectorType) {
    if (!conn?.id) {
      alert('No ID available for editing');
      return;
    }
    this.router.navigate(['/connector-types', conn.id, 'edit']);
  }

  /** 🔹 View details in modal */
  onView(conn: ConnectorType) {
    this.selectedConnector = conn;
    this.isViewing = true;
  }

  closeView() {
    this.isViewing = false;
    this.selectedConnector = null;
  }

  /** 🔹 Delete connector */
  onDelete(conn: ConnectorType) {
    if (!conn?.id) return;
    const confirmed = confirm(`Delete connector "${conn.displayName || conn.name}"?`);
    if (!confirmed) return;

    this.deletingMap[conn.id] = true;

    this.svc.delete(conn.id)
      .pipe(finalize(() => { this.deletingMap[conn.id] = false; }))
      .subscribe({
        next: () => {
          // remove deleted record from list instantly
          this.connectors = this.connectors.filter(c => c.id !== conn.id);
        },
        error: (err) => {
          console.error('Delete failed', err);
          alert('Delete failed: ' + (err?.message || 'Unknown error'));
        }
      });
  }

  /** 🔹 Display metadata summary */
  metadataSummary(conn: ConnectorType): string {
    const count = conn.metadataSchema?.length || 0;
    return count ? `${count} field${count > 1 ? 's' : ''}` : 'No metadata';
  }
}
