import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

type AuthMethod = 'usernamePassword' | 'windows' | 'sslCert' | 'kerberos';

@Component({
  selector: 'app-connect-to-postgresql',
 
  standalone: false,
  templateUrl: './connect-to-postgresql.html',
  styleUrls: ['./connect-to-postgresql.scss'] 
})
export class ConnectToPostgresql {
  connectionForm: FormGroup;
  activeTab: string = 'basic';
  passwordVisible = false;

  constructor(private fb: FormBuilder) {
    this.connectionForm = this.fb.group({
      connectionName: ['', Validators.required],
      host: ['', Validators.required],
      port: [5432, [Validators.required, Validators.min(1)]],
      database: ['', Validators.required],
      minConnections: [1, [Validators.min(0)]],
      maxConnections: [10, [Validators.min(1)]],
      timeout: [30, [Validators.min(0)]],
      ssl: [false],

      auth: this.fb.group({
        method: ['usernamePassword', Validators.required],

        
        username: [''],
        password: [''],

        
        domain: [''],

        
        sslMode: ['prefer'],
        clientCert: [null],
        clientKey: [null],
        clientCA: [null],

        
        principal: [''],
        serviceName: ['postgres'],
        keytab: [null]
      })
    });

    this.setupAuthValidation();
  }

  get authGroup(): FormGroup {
    return this.connectionForm.get('auth') as FormGroup;
  }

  get authMethod(): AuthMethod {
    return this.authGroup.get('method')?.value as AuthMethod;
  }

  private setupAuthValidation() {
    const methodCtrl = this.authGroup.get('method')!;
    methodCtrl.valueChanges.subscribe((m: AuthMethod) => this.applyAuthValidators(m));
    this.applyAuthValidators(methodCtrl.value as AuthMethod);
  }

  private applyAuthValidators(method: AuthMethod) {
    // Clear all validators first
    const clear = (name: string) => {
      const c = this.authGroup.get(name)!;
      c.clearValidators();
      c.updateValueAndValidity({ emitEvent: false });
    };

    ['username','password','domain','sslMode','clientCert','clientKey','clientCA','principal','serviceName','keytab'].forEach(clear);

    // Apply per-method
    if (method === 'usernamePassword') {
      this.authGroup.get('username')!.setValidators([Validators.required]);
      this.authGroup.get('password')!.setValidators([Validators.required]);
    }

    if (method === 'windows') {
      this.authGroup.get('domain')!.setValidators([Validators.required]);
    }

    if (method === 'sslCert') {
      this.authGroup.get('sslMode')!.setValidators([Validators.required]);
      this.authGroup.get('clientCert')!.setValidators([Validators.required]);
      this.authGroup.get('clientKey')!.setValidators([Validators.required]);
      this.authGroup.get('clientCA')!.setValidators([Validators.required]);
      this.connectionForm.get('ssl')!.setValue(true, { emitEvent: false });
    }

    if (method === 'kerberos') {
      this.authGroup.get('principal')!.setValidators([Validators.required]);
      this.authGroup.get('serviceName')!.setValidators([Validators.required]);
    }

    // Update after setting
    Object.keys(this.authGroup.controls).forEach(k => {
      this.authGroup.get(k)!.updateValueAndValidity({ emitEvent: false });
    });
  }

  onFileSelected(evt: Event, control: 'clientCert'|'clientKey'|'clientCA'|'keytab') {
    const file = (evt.target as HTMLInputElement).files?.[0] ?? null;
    this.authGroup.get(control)!.setValue(file);
    this.authGroup.get(control)!.markAsDirty();
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  testConnection() {
    if (this.connectionForm.invalid) {
      alert('Please fill all required fields');
      return;
    }
    // Replace with real API call
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
    this.connectionForm.reset({
      port: 5432,
      minConnections: 1,
      maxConnections: 10,
      timeout: 30,
      ssl: false,
      auth: { method: 'usernamePassword', serviceName: 'postgres', sslMode: 'prefer' }
    });
    this.passwordVisible = false;
  }
}
