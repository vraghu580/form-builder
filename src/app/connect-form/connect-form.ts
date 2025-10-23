import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { connectionTypeService } from '../services/connection-type-service'; // ✅ use your existing service

@Component({
  selector: 'app-connect-form',
  standalone: false,
  templateUrl: './connect-form.html',
  styleUrls: ['./connect-form.scss'] // ✅ fixed typo: styleUrl → styleUrls
})
export class ConnectForm implements OnInit {
  config: any;
  connectionForm!: FormGroup;
  activeTab: string = '';

  constructor(private fb: FormBuilder, private service: connectionTypeService) {} // ✅ corrected service

  ngOnInit(): void {
    // Temporary mock data for testing before backend is ready
    const mockConfig = {
      databaseType: 'PostgreSQL',
      tabs: [
        {
          name: 'basic',
          fields: [
            { key: 'host', label: 'Host', type: 'text', required: true },
            { key: 'port', label: 'Port', type: 'number', required: true },
            { key: 'database', label: 'Database', type: 'text', required: true }
          ]
        },
        {
          name: 'auth',
          fields: [
            { key: 'username', label: 'Username', type: 'text', required: true },
            { key: 'password', label: 'Password', type: 'password', required: true }
          ]
        }
      ]
    };

    // Simulating API data (you can replace this with a real API later)
    this.config = mockConfig;
    this.buildForm(mockConfig);
    this.activeTab = mockConfig.tabs[0].name;
  }

  buildForm(config: any): void {
    const formGroup: any = {};
    config.tabs.forEach((tab: any) => {
      tab.fields.forEach((field: any) => {
        const validators = field.required ? [Validators.required] : [];
        formGroup[field.key] = [field.default || '', validators];
      });
    });
    this.connectionForm = this.fb.group(formGroup);
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  connect(): void {
    if (this.connectionForm.invalid) {
      alert('Please fill all required fields');
      return;
    }
    console.log('Payload:', this.connectionForm.value);

    // Using your existing connectionTypeService
    this.service.createConnectionType(this.connectionForm.value).subscribe({
      next: (res) => console.log('Connection response:', res),
      error: (err) => console.error('Error:', err)
    });
  }
}
