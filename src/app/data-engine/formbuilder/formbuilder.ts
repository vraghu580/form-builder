import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formbuilder',
  standalone: false,
  templateUrl: './formbuilder.html',
})
export class Formbuilder implements OnInit {
  formGroup!: FormGroup;
  fields: any[] = [];
  selectedField: any = null;
  formTitle: string = 'Untitled Form';
  activeTab: string = 'elements';
  configTab: string = 'properties';
  basicFields = ['text', 'email', 'number', 'date', 'textarea', 'checkbox'];
  connectedSources = ['PostgreSQL Production', 'MongoDB Atlas', 'MySQL Analytics', 'Redis Cache'];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    const navState = history.state;
    if (navState?.importedColumns?.length > 0) {
      this.fields = navState.importedColumns;
      localStorage.setItem('importedColumns', JSON.stringify(this.fields));
    } else {
      const stored = localStorage.getItem('importedColumns');
      if (stored) this.fields = JSON.parse(stored);
    }

    // ensure fields have default validation properties
    this.fields = this.fields.map(f => ({
      required: !!f.required,
      validationRules: f.validationRules || '',
      dataType: f.dataType || 'text',
      displayLabel: f.displayLabel || f.columnName || 'Field',
      columnName: f.columnName || ('field_' + Math.random().toString(36).substring(2, 7)),
      ...f
    }));

    this.buildForm();
  }

  buildForm() {
    const group: any = {};
    this.fields.forEach((field) => {
      const key = field.columnName;
      const validators = this.getValidatorsForField(field);
      group[key] = new FormControl('', validators);
    });
    this.formGroup = this.fb.group(group);
  }

  // Build validators array from field properties
  getValidatorsForField(field: any): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    // required flag
    if (field.required) {
      validators.push(Validators.required);
    }

    // basic email validator if dataType is email
    const dt = (field.dataType || '').toString().toLowerCase();
    if (dt.includes('email')) {
      validators.push(Validators.email);
    }

    // parse simple validationRules string like "minLength:3,maxLength:20,pattern:^[0-9]+$"
    if (field.validationRules && field.validationRules.trim()) {
      const rules = field.validationRules.split(',').map((r: string) => r.trim());
      rules.forEach((rule: string) => {
        if (!rule) return;
        const [k, rawVal] = rule.split(':').map(s => s.trim());
        if (!k) return;

        if (k === 'minLength') {
          const n = parseInt(rawVal, 10);
          if (!isNaN(n)) validators.push(Validators.minLength(n));
        } else if (k === 'maxLength') {
          const n = parseInt(rawVal, 10);
          if (!isNaN(n)) validators.push(Validators.maxLength(n));
        } else if (k === 'pattern') {
          try {
            // pattern may include ":" so join remaining pieces if split earlier
            const patternRaw = rule.substring(rule.indexOf(':') + 1);
            validators.push(Validators.pattern(patternRaw));
          } catch (e) {
            // ignore invalid pattern
            console.warn('Invalid pattern in validationRules for', field.columnName);
          }
        }
      });
    }

    return validators;
  }

  // When selected field changed in UI
  selectField(field: any) {
    this.selectedField = field;
    this.configTab = 'properties';
  }

  // Update field property and also re-apply validators to the form control when relevant
  updateSelectedField(property: string, value: any) {
    if (!this.selectedField) return;
    this.selectedField[property] = value;

    // if validation-related property changed, update FormControl validators
    if (property === 'required' || property === 'validationRules' || property === 'dataType') {
      this.setFieldValidators(this.selectedField);
    }
  }

  // Set validators on the actual FormControl for a field
  setFieldValidators(field: any) {
    if (!this.formGroup) return;
    const key = field.columnName;
    const control = this.formGroup.get(key);
    if (!control) return;

    const validators = this.getValidatorsForField(field);
    control.setValidators(validators);
    control.updateValueAndValidity();
  }

  getInputType(dataType: string): string {
    if (!dataType) return 'text';
    const type = dataType.toLowerCase();
    if (type.includes('int') || type.includes('num')) return 'number';
    if (type.includes('date') || type.includes('time')) return 'date';
    if (type.includes('bool')) return 'checkbox';
    if (type.includes('email')) return 'email';
    return 'text';
  }

  addField() {
    const newField = {
      columnName: 'new_field_' + (this.fields.length + 1),
      dataType: 'text',
      displayLabel: 'New Field',
      required: false,
      validationRules: ''
    };
    this.fields.push(newField);

    // add control to formGroup as well
    if (this.formGroup) {
      const validators = this.getValidatorsForField(newField);
      this.formGroup.addControl(newField.columnName, new FormControl('', validators));
    }
  }

  addPredefinedField(type: string) {
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    const newField = {
      columnName: label.toLowerCase() + '_' + (this.fields.length + 1),
      dataType: type,
      displayLabel: label,
      placeholder: 'Enter ' + label,
      required: false,
      validationRules: ''
    };
    this.fields.push(newField);

    if (this.formGroup) {
      const validators = this.getValidatorsForField(newField);
      this.formGroup.addControl(newField.columnName, new FormControl('', validators));
    }
  }

  saveForm() {
    // small validation example: prevent save if form invalid
    if (this.formGroup.invalid) {
      alert('Form has invalid required/validation fields. Please fix them before saving.');
      // optionally highlight invalid controls
      Object.keys(this.formGroup.controls).forEach(key => {
        const c = this.formGroup.controls[key];
        if (c.invalid) c.markAsTouched();
      });
      return;
    }

    alert(`Form "${this.formTitle}" saved successfully!`);
  }

  back() {
    this.router.navigate(['/data-engine/data-schema']);
  }
}
