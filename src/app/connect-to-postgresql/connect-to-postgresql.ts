import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.loadMetadata();
  }

  loadMetadata() {
    this.http.get<any[]>('http://3.6.68.94/services/form-builder/connector-types').subscribe({
      next: (response) => {
        const postgresConnector = response.find(
          (item) => item.name?.toLowerCase() === 'postgres' || item.displayName?.toLowerCase().includes('postgres')
        );
        console.log('Postgres Connector:', postgresConnector);


        this.loading = false;

        if (postgresConnector && postgresConnector.id) {
          const connectorId = postgresConnector.id;
          this.metadataLoading = true;

          this.http.get<any>(`http://3.6.68.94/services/form-builder/connector-types/${connectorId}`).subscribe({
            next: (res) => {
              this.metadataFields = res.metadataSchema || [];
              this.createForm();
              this.metadataLoading = false;
              console.log(' Metadata Fields:', this.metadataFields);
            },
            error: (err) => {
              console.error(' Failed  fetch connector metadata:', err);
              this.metadataLoading = false;
            }
          });
        } else {
          console.warn(' Postgres connector not found in API list');
        }
      },
      error: (err) => {
        console.error(' Error fetching connector types:', err);
        this.loading = false;
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
      type: 'postgres',
      config: this.connectionForm.value
    };

    console.log('Testing connection with payload:', payload);

    this.http.post<any>('http://3.6.68.94/services/form-builder/connector-instances/test', payload)
      .subscribe({
        next: (res) => {
          console.log(' API Response:', res);
          if (res.success) {
            this.connectionStatus = 'success';
            alert(' Connection Successful!');
          } else {
            this.connectionStatus = 'failed';
            alert(' Connection Failed. Please check your details.');
          }
        },
        error: (err) => {
          console.error(' Connection test failed:', err);
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
      connectorTypeId: 'f126d6de-b0bc-405b-85a9-eea86f917683',
      name: 'postgres',
      createdBy: 'admin',
      config: this.connectionForm.value
    };

    console.log(' Creating Connector Instance with payload:', payload);
                             
    this.http.post<any>('http://3.6.68.94/services/form-builder/connector-instances', payload)
      .subscribe({
        next: (res) => {
          console.log(' Connector Instance Created:', res);

          if (res && res.id) {
            const instanceId = res.id;
            console.log(' Connector Instance ID:', instanceId);

            const fetchUrl = `http://3.6.68.94/services/form-builder/connector-instances/${instanceId}/fetch?mode=api`;
            const fetchBody = {
              options: {
                query: 'SELECT * FROM users'
              }
            };

            console.log(' Fetching schema for instance:', instanceId);

            this.http.post<any>(fetchUrl, fetchBody)
              .subscribe({
                next: (data) => {
                  console.log(' Schema Data (Fetched Successfully):', data);
                  localStorage.setItem('connectorInstanceId', instanceId);
                  localStorage.setItem('schemaData', JSON.stringify(data));

                  this.router.navigate(['/data-engine/schema'], {
                    state: { schemaData: data }
                  });
                },
                error: (err) => {
                  console.error(' Schema fetch failed after creation:', err);
                  alert('Schema fetch failed. Check backend logs.');
                }
              });
          } else {
            console.error(' No connector instance ID returned from backend');
          }
        },
        error: (err) => {
          console.error(' Error creating connector instance:', err);
          alert('Failed to create connector instance.');
        }
      });
  }
}
