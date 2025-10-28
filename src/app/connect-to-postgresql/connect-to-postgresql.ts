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

  connectorName: string = '';
  connectorTypeId: string = '';
  connectorCategory: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.connectorName =
      this.route.snapshot.paramMap.get('connectorName')?.toLowerCase() || 'unknown';
    console.log('Route parameter received:', this.route.snapshot.paramMap.get('connectorName'));

   
    const navState = this.router.getCurrentNavigation()?.extras?.state;
    const stateData = (navState || history.state) as {
      connectorTypeId?: string;
      metadataSchema?: any;
    };

    
    if (stateData?.connectorTypeId) {
      this.connectorTypeId = stateData.connectorTypeId;
      console.log(' Received connectorTypeId:', this.connectorTypeId);
    }

    if (stateData?.metadataSchema) {
      console.log(' Received metadataSchema from navigation:', stateData.metadataSchema);
      this.metadataFields = stateData.metadataSchema;
      this.createForm();
      this.loading = false;
    } else {
      console.warn(' No metadataSchema in route state. Falling back to API.');
      this.loadMetadata(); 
    }
  }

  loadMetadata() {
    // this.http.get<any[]>('http://3.6.68.94/services/form-builder/connector-types').subscribe({
    //   // next: (response) => {
    //   //   const connector = response.find(
    //   //     (item) =>
    //   //       item.name?.toLowerCase() === this.connectorName ||
    //   //       item.displayName?.toLowerCase().includes(this.connectorName)
    //   //   );

    //   //   console.log('Matched connector:', connector);

    //   //   if (connector && connector.id) {
    //   //     this.connectorTypeId = connector.id; // ✅ also assign here as backup
    //   //     this.connectorCategory = connector.category || 'database';
    //   //     this.fetchMetadata(connector.id);
    //   //   } else {
    //   //     console.warn(`No connector metadata found for: ${this.connectorName}`);
    //   //     this.loading = false;
    //   //   }
    //   // },
    //   // error: (err) => {
    //   //   console.error('Error fetching connector types:', err);
    //   //   this.loading = false;
    //   // }
    // });
  }

  fetchMetadata(connectorId: string) {
    
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
    const payload = {
      type: this.connectorName,
      config: this.connectionForm.value
    };

    console.log('Testing connection with payload:', payload);

    this.http
      .post<any>('http://3.6.68.94/services/form-builder/connector-instances/test', payload)
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
  
  this.connectionForm.markAllAsTouched();
  this.connectionForm.updateValueAndValidity();

  
  localStorage.removeItem('schemaData');

  
  if (this.connectionForm.invalid) {
    alert(' Please fill all required fields before connecting.');
    console.warn('Form is invalid. Aborting connection.');
    return;
  }

  
  if (this.connectionStatus !== 'success') {
    alert(' Please test the connection successfully before connecting.');
    console.warn('Connection not tested yet. Aborting.');
    return;
  }

  const payload = {
    connectorTypeId: this.connectorTypeId,
    name: this.connectorName,
    createdBy: 'admin',
    config: this.connectionForm.value
  };

  console.log('Creating Connector Instance with payload:', payload);

  this.http
    .post<any>('http://3.6.68.94/services/form-builder/connector-instances', payload)
    .subscribe({
      next: (res) => {
        console.log(' Connector Instance Created Successfully:', res);

        const instanceId = res.id;
        if (!instanceId) {
          alert(' Instance ID not found. Please try again.');
          return;
        }

        const fetchUrl = `http://3.6.68.94/services/form-builder/connector-instances/${instanceId}/fetch?mode=api`;
        console.log('Triggering fetch request to:', fetchUrl);

        this.http.post<any>(fetchUrl, {}).subscribe({
          next: (fetchRes) => {
            console.log(' Fetch API Response:', fetchRes);

          
            if (fetchRes?.success && Array.isArray(fetchRes.result)) {
  // ✅ Store schema data first
  localStorage.setItem('schemaData', JSON.stringify(fetchRes));

  console.log('✅ Schema stored successfully. Navigating shortly...');

  // ✅ Small delay ensures data sync before navigation
  setTimeout(() => {
    this.router.navigate(['/data-engine/data-schema'], {
      state: { schemaData: fetchRes }
    });
  }, 300);

  alert('Connector instance created and schema fetched successfully!');
} else {
  alert('Fetch completed but returned invalid data.');
}
          },
          error: (fetchErr) => {
            console.error(' Fetch API Failed:', fetchErr);
            alert('Connector instance created, but fetch failed.');
          }
        });
      },
      error: (err) => {
        console.error(' Error creating connector instance:', err);
        alert('Failed to create connector instance.');
      }
    });
}


  }



