import { Component } from '@angular/core';

@Component({
  selector: 'app-single-page-form',
  standalone: false,
  templateUrl: './single-page-form.html',
  styleUrl: './single-page-form.scss'
})
export class SinglePageForm {
  activeFields: any[] = [];
  selectedFieldIndex: number | null = null;
  isValidationEnabled = false;
  selectedTab: 'field-types' | 'attribute' = 'field-types';

  fieldTypes = [
    { type: 'text', icon: 'bi-fonts', name: 'Text Input', placeholder: 'Enter Your Name' },
    { type: 'number', icon: 'bi-hash', name: 'Number', placeholder: 'Enter a Number' },
    { type: 'email', icon: 'bi-envelope', name: 'Email', placeholder: 'Enter your Email' },
    { type: 'number', icon: 'bi-telephone', name: 'Phone', placeholder: 'Enter your Phone Number' },
    { type: 'url', icon: 'bi-link-45deg', name: 'Url', placeholder: 'Enter URL' },
    { type: 'textarea', icon: 'bi-file-earmark-text', name: 'Text Area', placeholder: 'Enter Description' },
    { type: 'Check Box', icon: 'bi-check-square', name: 'Checkbox', options: ['Option A', 'Option B'] },
    { type: 'dropdown', icon: 'bi-caret-down-square', name: 'Dropdown', placeholder: 'Select option', options: ['Option X', 'Option Y', 'Option Z'] },
    { type: 'radio', icon: 'bi-record-circle', name: 'Radio Button', options: ['Option 1', 'Option 2'] }
  ];

  Attribute = [
    { icon: 'bi-fonts', attributeName: 'Simple Attribute', attributeDiscription: 'Single Value Field' },
    { icon: 'bi-calculator', attributeName: 'Composite Attribute', attributeDiscription: 'Complex structure (address, name)' },
  ];

  setTab(tab: 'field-types' | 'attribute') {
    this.selectedTab = tab;
  }

  addfield(field: any) {
    this.activeFields.push({
      ...field,
      label: field.name,
      value: '',
      selectedOptions: {},
      required: false,
    });
  }

  removeField(index: number) {
    this.activeFields.splice(index, 1);
    if (this.selectedFieldIndex === index) {
      this.selectedFieldIndex = null;
    } else if (this.selectedFieldIndex !== null && this.selectedFieldIndex > index) {
      this.selectedFieldIndex--;
    }
  }

  selectField(index: number) {
    this.selectedFieldIndex = index;
  }

  previewMode: 'phone' | 'tablet' | 'desktop' = 'desktop';

  setPreview(mode: 'phone' | 'tablet' | 'desktop') {
    this.previewMode = mode;
  }

  toggleRequiredField() {
    if (this.selectedFieldIndex !== null) {
      this.activeFields[this.selectedFieldIndex].required =
        !this.activeFields[this.selectedFieldIndex].required;
    }
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

  addOption() {
    if (this.selectedFieldIndex !== null) {
      if (!this.activeFields[this.selectedFieldIndex].options) {
        this.activeFields[this.selectedFieldIndex].options = [];
      }
      this.activeFields[this.selectedFieldIndex].options.push('New Option');
    }
  }

  removeOption(i: number) {
    if (this.selectedFieldIndex !== null) {
      const opts = this.activeFields[this.selectedFieldIndex].options || [];
      opts.splice(i, 1);
    }
  }

  saveForm() {
    if (this.activeFields.length === 0) {
      console.warn('⚠️ No fields added to form.');
    } else {
      console.log('💾 Form Structure:', JSON.stringify(this.activeFields, null, 2));
    }
  }

  submitForm() {
    const submittedData: any = {};
    this.activeFields.forEach(field => {
      if (field.type === 'Check Box') {
        const selected = Object.keys(field.selectedOptions).filter(key => field.selectedOptions[key]);
        submittedData[field.label] = selected;
      } else {
        submittedData[field.label] = field.value || '';
      }
    });
    console.log('✅ Form Submitted Data:', submittedData);
  }

}
