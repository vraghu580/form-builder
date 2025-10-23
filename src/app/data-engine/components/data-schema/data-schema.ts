

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-schema',
  standalone: false,
  templateUrl: './data-schema.html',
  styleUrl: './data-schema.scss'
})
export class DataSchema implements OnInit {

  loading = true;
  schemaData: any[] = [];
  errorMsg = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchSchema();
  }

  fetchSchema() {
    const payload = {
      type: 'postgres',
      config: {
        host: 'postgres',
        port: 5432,
        user: 'postgres',
        password: 'root',
        database: 'Users'
      }
    };

    console.log('📡 Fetching schema with payload:', payload);

    this.http.post<any>('http://3.6.68.94/services/form-builder/connector-instances/bd1be8bf-d5ce-4d4a-8d47-e2c4fd570217/fetch?mode=api', payload)
      .subscribe({
        next: (res) => {
          console.log(' Schema Response:', res);
          if (res.success && res.schemas) {
            this.schemaData = res.schemas;
          } else {
            this.errorMsg = res.message || 'No schema data available.';
          }
          this.loading = false;
        },
        error: (err) => {
          console.error(' Schema fetch failed:', err);
          this.errorMsg = 'Error fetching schema data. Please try again.';
          this.loading = false;
        }
      });
  }

  backToConnection() {
    this.router.navigate(['/data-engine/connect-manage']);
  }
}

