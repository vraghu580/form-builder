import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-connect-mysql',
  standalone: false,
  templateUrl: './connect-mysql.html',
  styleUrl: './connect-mysql.scss'
})
export class ConnectMysql {
connectionForm: FormGroup;
  activeTab: string = 'basic';

  constructor(private fb: FormBuilder) {
    this.connectionForm = this.fb.group({
      connectionName: ['', Validators.required],
      host: ['', Validators.required],
      port: [3306, Validators.required],
      database: ['', Validators.required],
      minConnections: [1],
      maxConnections: [10],
      timeout: [30],
      username: [''],
      password: [''],
      ssl: [false],
    });
}


  switchTab(tab: string) {
    this.activeTab = tab;
  }

  testConnection() {
    if (this.connectionForm.invalid) {
      alert('Please fill all required fields');
      return;
    }
    alert('Testing connection...');
  }

  connect() {
    if (this.connectionForm.invalid) {
      alert('Please fill all required fields');
      return;
    }
    console.log('Form Data:', this.connectionForm.value);
    alert('Connected successfully (simulation)');
  }
  cancel() {
    this.connectionForm.reset();
  }

}