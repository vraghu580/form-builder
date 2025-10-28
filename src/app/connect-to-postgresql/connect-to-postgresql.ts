import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectorTypeInstance } from '../services/connector-type-instance';

@Component({
  selector: 'app-connect-to-postgresql',
  standalone: false,
  templateUrl: './connect-to-postgresql.html',
  styleUrls: ['./connect-to-postgresql.scss']
})
export class ConnectToPostgresql implements OnInit {


  connectionForm!: FormGroup;
  metadataFields: any[] = [];
  activeTab: string = 'basic';
  loading: boolean = true;
  connectionStatus: 'idle' | 'testing' | 'success' | 'failed' = 'idle';
  metadataLoading: boolean = false;

  connectorName: string = '';
  connectorTypeId: string = '';
  connectorCategory: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private connectorService: ConnectorTypeInstance
  ) { }

  ngOnInit(): void {
    this.connectorName =
      this.route.snapshot.paramMap.get('connectorName')?.toLowerCase() || 'unknown';
    console.log('Route parameter received:', this.connectorName);

    const navState = this.router.getCurrentNavigation()?.extras?.state;
    const stateData = (navState || history.state) as {
      connectorTypeId?: string;
      metadataSchema?: any;
    };

    if (stateData?.connectorTypeId) {
      this.connectorTypeId = stateData.connectorTypeId;
      console.log('Received connectorTypeId:', this.connectorTypeId);
    }

    if (stateData?.metadataSchema) {
      console.log('Received metadataSchema from navigation:', stateData.metadataSchema);
      this.metadataFields = stateData.metadataSchema;
      this.createForm();
      this.loading = false;
    } else {
      console.warn('No metadataSchema in route state. Falling back to API.');
      this.loadMetadata();
    }
  }

  loadMetadata() { }

  createForm() {
    const formGroup: any = {};
    this.metadataFields.forEach((field) => {
      formGroup[field.key] = ['', field.required ? Validators.required : []];
    });
    this.connectionForm = this.fb.group(formGroup);
  }

  getFieldsByTab(tabName: string) {
    if (tabName === 'basic') {
      return this.metadataFields.filter((f) => !f.tab || f.tab.toLowerCase() === 'basic');
    }
    return this.metadataFields.filter(
      (f) => f.tab && f.tab.toLowerCase() === tabName.toLowerCase()
    );
  }

  getInputType(type: string) {
    if (type === 'password') return 'password';
    if (type === 'number') return 'number';
    return 'text';
  }

  switchTab(tabName: string) {
    this.activeTab = tabName;
  }

  testConnection() {
    if (this.connectionForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

    this.connectionStatus = 'testing';

    const payload = {
      type: this.connectorName,
      config: this.connectionForm.value
    };

    console.log('Testing connection with payload:', payload);

    this.connectorService.testConnection(payload).subscribe({
      next: (res) => {
        console.log('API Response:', res);
        if (res.success) {
          this.connectionStatus = 'success';
          alert(' Connection Successful!');
        } else {
          this.connectionStatus = 'failed';
          alert('Connection Failed. Please check your details.');
        }
      },
      error: (err) => {
        console.error('Connection test failed:', err);
        this.connectionStatus = 'failed';
        alert(' Connection Failed. Please check your details.');
      }
    });
  }

  connect() {
    this.connectionForm.markAllAsTouched();
    this.connectionForm.updateValueAndValidity();
    localStorage.removeItem('schemaData');

    if (this.connectionForm.invalid) {
      alert('Please fill all required fields before connecting.');
      return;
    }

    if (this.connectionStatus !== 'success') {
      alert('Please test the connection successfully before connecting.');
      return;
    }

    const payload = {
      connectorTypeId: this.connectorTypeId,
      name: this.connectorName,
      createdBy: 'admin',
      config: this.connectionForm.value
    };

    console.log('Creating Connector Instance with payload:', payload);

    this.connectorService.createInstance(payload).subscribe({
      next: (res) => {
        console.log('Connector Instance Created Successfully:', res);

        const instanceId = res.id;
        if (!instanceId) {
          alert('Instance ID not found. Please try again.');
          return;
        }

        console.log('Triggering fetch for schema data...');

        this.connectorService.fetchSchema(instanceId).subscribe({
          next: (fetchRes) => {
            console.log('Fetch API Response:', fetchRes);

            if (fetchRes?.success && Array.isArray(fetchRes.result)) {
              localStorage.setItem('schemaData', JSON.stringify(fetchRes));

              setTimeout(() => {
                this.router.navigate(['/data-engine/data-schema'], {
                  state: { schemaData: fetchRes }
                });
              }, 300);

              alert(' Connector instance created and schema fetched successfully!');
            } else {
              alert(' Fetch completed but returned invalid data.');
            }
          },
          error: (fetchErr) => {
            console.error('Fetch API Failed:', fetchErr);
            alert('Connector instance created, but fetch failed.');
          }
        });
      },
      error: (err) => {
        console.error('Error creating connector instance:', err);
        alert(' Failed to create connector instance.');
      }
    });
  }
}
