import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-schema',
  standalone: false,
  templateUrl: './data-schema.html',
  styleUrls: ['./data-schema.scss']
})
export class DataSchema implements OnInit {

  loading = true;
  schemaData: any;
  errorMsg = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    
    const navState = history.state;
    if (navState && navState.schemaData) {
      console.log('📦 Received Schema Data from previous screen:', navState.schemaData);
      this.schemaData = navState.schemaData;
      this.loading = false;
      return;
    }

    
    const savedSchema = localStorage.getItem('schemaData');
    if (savedSchema) {
      console.log('📂 Loaded schema data from localStorage:', JSON.parse(savedSchema));
      this.schemaData = JSON.parse(savedSchema);
      this.loading = false;
      return;
    }

    
    this.fetchSchema();
  }

  
  fetchSchema() {
    // const instanceId = localStorage.getItem('connectorInstanceId');
    // if (!instanceId) {
    //   console.error(' No connector instance found in localStorage.');
    //   this.errorMsg = 'No connector instance found.';
    //   this.loading = false;
    //   return;
    // }

    // console.log(' Fetching schema using instance ID:', instanceId);

    // const url = `http://3.6.68.94/services/form-builder/connector-instances/${instanceId}/fetch?mode=api`;
    // const body = {
    //   options: {
    //     query: 'SELECT * FROM users'
    //   }
    // };

    // this.http.post<any>(url, body)
    //   .subscribe({
    //     next: (res) => {
    //       console.log(' Schema Data (From Backend):', res);
    //       this.schemaData = res;
    //       localStorage.setItem('schemaData', JSON.stringify(res)); 
    //       this.loading = false;
    //     },
    //     error: (err) => {
    //       console.error(' Schema fetch failed:', err);
    //       this.errorMsg = 'Error fetching schema data.';
    //       this.loading = false;
    //     }
    //   });
  }

  backToConnection() {
    this.router.navigate(['/data-engine/connect-manage']);
  }
}
