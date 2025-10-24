import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

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
  connectorTypeId: string = ''; 
  connectToName: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadMetadata();
    this.connectToName = this.route.snapshot.paramMap.get('name') || 'Unknown';
  }

  // ✅ STEP 1: Load metadata and store connectorTypeId
  loadMetadata() {
    this.http.get<any[]>('http://3.6.68.94/services/form-builder/connector-instances').subscribe({
      next: (response) => {
        const postgresConnector = response.find(
          (item) =>
            item.name?.toLowerCase() === 'postgres' ||
            item.displayName?.toLowerCase().includes('postgres')
        );

        if (postgresConnector?.id) {
          this.connectorTypeId = this.connectorTypeId
          console.log('✅ Connector Type ID:', this.connectorTypeId);

          // fetch schema for the form fields
          this.http
            .get<any>(
              `http://3.6.68.94/services/form-builder/connector-instances/${this.connectorTypeId}`
            )
            .subscribe({
              next: (res) => {
                this.metadataFields = res.metadataSchema || [];
                console.log('✅ Loaded metadata schema:', this.metadataFields);
                this.createForm();
                this.loading = false;
              },
              error: (err) => {
                console.error('❌ Failed to load metadata details:', err);
                this.loading = false;
              },
            });
        } else {
          console.error('❌ Postgres connector not found in connector-types response');
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('❌ Failed to fetch connector types:', err);
        this.loading = false;
      },
    });
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
      return this.metadataFields.filter(
        (f) => !f.tab || f.tab.toLowerCase() === 'basic'
      );
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

  // ✅ STEP 2: Test Connection
  testConnection() {
  if (this.connectionForm.invalid) {
    alert('Please fill all required fields');
    return;
  }

  // use the correct connectorTypeId that works in Postman
  const correctConnectorTypeId = 'f9c75b5c-a9b2-4459-9532-f39d966bfb7d'; 

  this.connectionStatus = 'testing';

  const payload = {
    connectorTypeId: correctConnectorTypeId,
    name: 'postgres',
    createdBy: 'admin',
    config: {
      host: this.connectionForm.value.host,
      port: this.connectionForm.value.port,
      user: this.connectionForm.value.user,
      password: this.connectionForm.value.password,
      database: this.connectionForm.value.database
    }
  };

  console.log('🧩 Sending payload:', payload);

  this.http.post<any>('http://3.6.68.94/services/form-builder/connector-instances/test', payload)
    .subscribe({
      next: (res) => {
        console.log('✅ API Response:', res);
        if (res.success) {
          this.connectionStatus = 'success';
          alert('✅ Connection Successful!');
        } else {
          this.connectionStatus = 'failed';
          alert('❌ Connection Failed. Please check your details.');
        }
      },
      error: (err) => {
        console.error('❌ Connection test failed:', err);
        this.connectionStatus = 'failed';
        alert('❌ Connection Failed. Please check your details.');
      }
    });
}


  connect() {
    if (this.connectionStatus !== 'success') {
      alert('Please test the connection first before connecting.');
      return;
    }

    console.log('Connection confirmed. Proceeding to next step...');
    this.router.navigate(['/data-engine/schema']);
  }

  cancel() {
    this.connectionForm.reset();
    this.connectionStatus = 'idle';
  }
}
