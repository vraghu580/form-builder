import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { connectionTypeService } from '../../services/connection-type-service';

@Component({
  selector: 'app-edit-connector-type',
  standalone: false,
  templateUrl: './edit-connector-type.html',
  styleUrl: './edit-connector-type.scss'
})
export class EditConnectorType implements OnInit {
  connectorForm!: FormGroup;
  connectorId!: string;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,            // Angular Router
    private svc: connectionTypeService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.connectorId = this.route.snapshot.params['id'];
    this.initForm();
    if (this.connectorId) this.loadConnector(this.connectorId);
  }

  initForm() {
    this.connectorForm = this.fb.group({
      name: ['', Validators.required],
      displayName: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      metadataSchema: [[]]
    });
  }

  loadConnector(id: string) {
    this.loading = true;
    this.svc.getById(id).subscribe({
      next: (data: any) => {
        this.connectorForm.patchValue(data);
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err?.message || 'Failed to load connector';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.connectorForm.invalid) return;

    this.loading = true;
    this.svc.update(this.connectorId, this.connectorForm.value).subscribe({
      next: () => {
        this.loading = false;
        alert('Connector updated successfully!');
        this.router.navigate(['/connector-type']);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err?.message || 'Update failed';
      }
    });
  }
}
