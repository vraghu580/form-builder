import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  metadataLoading: boolean = false;
  connectorName: string = '';  // 👈 dynamic connector name
  connectorId: string = '';     // 👈 will be set after API call

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  connectionName: string ='';


  ngOnInit(): void { 
    this.loadMetadata();
        this.connectionName = this.route.snapshot.paramMap.get('name') || 'Unknown';

  }

  loadMetadata() {
    this.http.get<any[]>('http://3.6.68.94/services/form-builder/connector-types').subscribe({
      next: (response) => {
        console.log('All Connectors:', response);

        // ✅ Find connector dynamically based on route name
        const connector = response.find(
          (item) =>
            item.name?.toLowerCase() === this.connectorName ||
            item.displayName?.toLowerCase().includes(this.connectorName)
        );

        if (connector && connector.id) {
          this.connectorId = connector.id;
          this.fetchMetadata(connector.id);
        } else {
          console.warn(`No metadata found for connector: ${this.connectorName}`);
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error fetching connector types:', err);
        this.loading = false;
      }
    });
  }

  fetchMetadata(connectorId: string) {
    this.metadataLoading = true;

    this.http.get<any>(`http://3.6.68.94/services/form-builder/connector-types/${connectorId}`).subscribe({
      next: (res) => {
        this.metadataFields = res.metadataSchema || [];
        this.createForm();
        this.loading = false;
        this.metadataLoading = false;
        console.log(`${this.connectorName} Metadata Fields:`, this.metadataFields);
      },
      error: (err) => {
        console.error('Failed to fetch connector metadata:', err);
        this.metadataLoading = false;
      }
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
      return this.metadataFields.filter((f) => !f.tab || f.tab.toLowerCase() === 'basic');
    }
    return this.metadataFields.filter((f) => f.tab && f.tab.toLowerCase() === tabName.toLowerCase());
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
      type: this.connectorName, // 👈 dynamic
      config: this.connectionForm.value
    };

    console.log('Testing connection with payload:', payload);

    this.http.post<any>('http://3.6.68.94/services/form-builder/connector-instances/test', payload)
      .subscribe({
        next: (res) => {
          console.log('API Response:', res);
          if (res.success) {
            this.connectionStatus = 'success';
            alert('Connection Successful!');
          } else {
            this.connectionStatus = 'failed';
            alert('Connection Failed. Please check your details.');
          }
        },
        error: (err) => {
          console.error('Connection test failed:', err);
          this.connectionStatus = 'failed';
          alert('Connection Failed. Please check your details.');
        }
      });
  }

  connect() {
    if (this.connectionStatus !== 'success') {
      alert('Please test the connection first before connecting.');
      return;
    }

    const payload = {
      connectorTypeId: this.connectorId, // 👈 dynamic
      name: this.connectorName,          // 👈 dynamic
      createdBy: 'admin',
      config: this.connectionForm.value
    };

    console.log('Creating Connector Instance with payload:', payload);

    this.http.post<any>('http://3.6.68.94/services/form-builder/connector-instances', payload)
      .subscribe({
        next: (res) => {
          console.log('Connector Instance Created:', res);
          // Rest of your existing fetch logic remains same
        },
        error: (err) => {
          console.error('Error creating connector instance:', err);
          alert('Failed to create connector instance.');
        }
      });
  }

 
}
