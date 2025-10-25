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
  connectionName: string ='';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private route:ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadMetadata();
        this.connectionName = this.route.snapshot.paramMap.get('name') || 'Unknown';

  }

  // Get metadata
  loadMetadata() {
    this.http.get<any[]>('http://3.6.68.94/services/form-builder/connector-types').subscribe({
      next: (response) => {
        const postgresConnector = response.find(
          (item) => item.name?.toLowerCase() === 'postgres' || item.displayName?.toLowerCase().includes('postgres')
        );
        console.log('Postgres Connector:', postgresConnector);

        if (postgresConnector && postgresConnector.id) {
          const connectorId = postgresConnector.id;

          this.http.get<any>(`http://3.6.68.94/services/form-builder/connector-types/${connectorId}`).subscribe({
            next: (res) => {
              this.metadataFields = res.metadataSchema || [];
              this.createForm();
              this.loading = false;
              this.cdr.detectChanges()
            },
            error: () => (this.loading = false)
          });
        } else {
          this.loading = false;
        }
      },
      error: () => (this.loading = false)
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
    type: 'postgres', 
    config: this.connectionForm.value
  }; 
  console.log('Testing connection with payload);', payload);

  this.http.post<any>('http://3.6.68.94/services/form-builder/connector-instances/test', payload)
    .subscribe({
      next: (res) => {
        console.log('✅ API Response:', res);

        // backend should return { success: true } or similar
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
    // Navigate to schema page
    this.router.navigate(['/data-engine/schema']);
  }

  cancel() {
    this.connectionForm.reset();
    this.connectionStatus = 'idle';
  }

 
}