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
  connectorTypeId: string = ''; // ✅ fix — will store received ID here
  connectorCategory: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private connectorInstance: ConnectorTypeInstance
  ) { }

  ngOnInit(): void {
    this.connectorName =
      this.route.snapshot.paramMap.get('connectorName')?.toLowerCase() || 'unknown';
    console.log('Route parameter received:', this.route.snapshot.paramMap.get('connectorName'));

    // ✅ use both getCurrentNavigation + history fallback
    const navState = this.router.getCurrentNavigation()?.extras?.state;
    const stateData = (navState || history.state) as {
      connectorTypeId?: string;
      metadataSchema?: any;
    };

    // ✅ store connectorTypeId properly
    if (stateData?.connectorTypeId) {
      this.connectorTypeId = stateData.connectorTypeId;
      console.log('✅ Received connectorTypeId:', this.connectorTypeId);
    }

    // ✅ handle metadataSchema
    if (stateData?.metadataSchema) {
      console.log('✅ Received metadataSchema from navigation:', stateData.metadataSchema);
      this.metadataFields = stateData.metadataSchema;
      this.createForm();
      this.loading = false;
    } else {
      console.warn('⚠️ No metadataSchema in route state. Falling back to API.');
      this.loadMetadata(); // fallback
    }
  }

  loadMetadata() {
    // this.http.get<any[]>('http://3.6.68.94/services/form-builder/connector-types').subscribe({
    //   next: (response) => {
    //     const connector = response.find(
    //       (item) =>
    //         item.name?.toLowerCase() === this.connectorName ||
    //         item.displayName?.toLowerCase().includes(this.connectorName)
    //     );

    //     console.log('Matched connector:', connector);

    //     if (connector && connector.id) {
    //       this.connectorTypeId = connector.id; // ✅ also assign here as backup
    //       this.connectorCategory = connector.category || 'database';
    //       this.fetchMetadata(connector.id);
    //     } else {
    //       console.warn(`No connector metadata found for: ${this.connectorName}`);
    //       this.loading = false;
    //     }
    //   },
    //   error: (err) => {
    //     console.error('Error fetching connector types:', err);
    //     this.loading = false;
    //   }
    // });
  }

  fetchMetadata(connectorId: string) {
    // this.http
    //   .get<any>(`http://3.6.68.94/services/form-builder/connector-types/${connectorId}`)
    //   .subscribe({
    //     next: (res) => {
    //       this.metadataFields = res.metadataSchema || [];
    //       console.log(`Metadata fields for ${this.connectorName}:`, this.metadataFields);
    //       this.createForm();
    //       this.loading = false;
    //       this.metadataLoading = false;
    //       this.cdr.detectChanges();
    //     },
    //     error: (err) => {
    //       console.error('Failed to fetch connector metadata:', err);
    //       this.metadataLoading = false;
    //     }
    //   });
  }

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

    this.connectionStatus = 'testing';
    const payload = {
      type: this.connectorName,
      config: this.connectionForm.value

    };

    console.log('Testing connection with payload:', payload);

    this.connectorInstance.testConnectorInstance(payload).subscribe({
      next: (res: any) => {
        console.log('API Response:', res);
        if (res.success || res.status === 'success') {
          this.connectionStatus = 'success';
          alert('✅ Connection Successful!');
        } else {
          this.connectionStatus = 'failed';
          alert('❌ Connection Failed. Please check your details.');
        }
      },
      error: (err) => {
        console.error('Connection test failed:', err);
        this.connectionStatus = 'failed';
        alert('❌ Connection Failed. Invalid connectorTypeId or bad config.');
      }
    });
  }

  connect() {
    if (this.connectionForm.invalid) {
      alert('Please fill all required fields before connecting.');
      return;
    }

    const payload = {
      connectorTypeId: this.connectorTypeId,
      name: this.connectorName,
      createdBy: 'admin',
      config: this.connectionForm.value
    };

    console.log('Creating Connector Instance with payload:', payload);

    // Using service
    this.connectorInstance.createConnectorInstance(payload).subscribe({
      next: (res: any) => {
        console.log('✅ Connector Instance Created Successfully:', res);

        const instanceId = res.id;
        if (instanceId) {
          this.connectorInstance.fetchConnectorInstance(instanceId).subscribe({
            next: (fetchRes: any) => {
              console.log('✅ Fetch API Response:', fetchRes);
              alert('Connector instance created and fetch completed successfully!');
            },
            error: (fetchErr) => {
              console.error('⚠️ Fetch API Failed:', fetchErr);
              alert('Connector instance created, but fetch failed.');
            }
          });
        } else {
          console.warn('⚠️ No instance ID returned from creation response.');
        }
      },
      error: (err) => {
        console.error('❌ Error creating connector instance:', err);
        alert('Failed to create connector instance.');
      }
    });
  }
}