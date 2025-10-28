import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formbuilder',
  standalone: false,
  templateUrl: './formbuilder.html'
})
export class Formbuilder implements OnInit {
  formGroup!: FormGroup;
  fields: any[] = [];
  selectedField: any = null;
  formTitle: string = 'Untitled Form';

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    const navState = history.state;
    console.log(' Received Navigation State:', navState);

    if (navState?.importedColumns?.length > 0) {
      this.fields = navState.importedColumns;
      localStorage.setItem('importedColumns', JSON.stringify(this.fields));
    } else {
      const stored = localStorage.getItem('importedColumns');
      if (stored) this.fields = JSON.parse(stored);
    }

    this.buildForm();
  }

  buildForm() {
    const group: any = {};
    this.fields.forEach((field) => {
      const key = field.columnName || field.key || 'field_' + Math.random().toString(36).substring(2, 7);
      group[key] = new FormControl('');
    });
    this.formGroup = this.fb.group(group);
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

  selectField(field: any) {
    this.selectedField = field;
  }

  updateSelectedField(property: string, value: string) {
    if (this.selectedField) {
      this.selectedField[property] = value;
    }
  }

  addField() {
    const newField = { columnName: 'New Field', dataType: 'text', displayLabel: 'New Field' };
    this.fields.push(newField);
    this.buildForm();
  }

  
  addPredefinedField(type: string) {
    const fieldLabel = type.charAt(0).toUpperCase() + type.slice(1);
    const newField = {
      columnName: fieldLabel.toLowerCase() + '_' + (this.fields.length + 1),
      dataType: type.toLowerCase(),
      displayLabel: fieldLabel,
      placeholder: 'Enter ' + fieldLabel
    };

    this.fields.push(newField);
    this.buildForm();
  }

  saveForm() {
    alert(` Form "${this.formTitle}" saved successfully!`);
  }

  back() {
    this.router.navigate(['/data-engine/data-schema']);
  }
}
