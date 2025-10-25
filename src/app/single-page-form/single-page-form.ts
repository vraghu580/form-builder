import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Template } from '../services/template';
import { FormTemplate } from '../services/template';

export interface FormField {
  type: string;
  icon: string;
  name: string;
  placeholder?: string;
  options?: string[];
  label?: string;
  value?: string;
  selectedOptions?: { [key: string]: boolean };
  required?: boolean;
}

export interface AttributeItem {
  icon: string;
  attributeName: string;
  attributeDiscription: string;
}

export interface FormStructure {
  title: string;
  description: string;
  fields: FormField[];
  formType?: string;
}

@Component({
  selector: 'app-single-page-form',
  standalone: false,
  templateUrl: './single-page-form.html',
  styleUrls: ['./single-page-form.scss']
})
export class SinglePageForm {
  activeFields: any[] = [];
  selectedFieldIndex: number | null = null;
  isValidationEnabled = false;
  selectedTab: 'field-types' | 'attribute' = 'field-types';
  formTitle: string = 'Form Title';
  formDescription: string = 'Form description goes here';
  formType: string = 'Single Page Form';
  selectedFormProperty: 'title' | 'description' | null = null;

  fieldTypes: FormField[] = [
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

  Attribute: AttributeItem[] = [
    { icon: 'bi-fonts', attributeName: 'Simple Attribute', attributeDiscription: 'Single Value Field' },
    { icon: 'bi-calculator', attributeName: 'Composite Attribute', attributeDiscription: 'Complex structure (address, name)' }
  ];

  previewMode: 'phone' | 'tablet' | 'desktop' = 'desktop';

  constructor(private templateService: Template, private router: Router) { }

  ngOnInit() {
    const selectedTemplate = this.templateService.getTemplate();
    if (selectedTemplate) {
      this.formTitle = selectedTemplate.title || 'Form Title';
      this.formDescription = selectedTemplate.description || 'Form description goes here';
      if (selectedTemplate.fields && selectedTemplate.fields.length > 0) {
        this.activeFields = selectedTemplate.fields.map((field: any) => ({
          label: field.label || field.name,
          type: field.type,
          placeholder: field.placeholder || field.label || '',
          value: field.value || '',
          required: field.required || false,
          options: field.options || [],
          selectedOptions: field.selectedOptions || {}
        }));
      }
    }
  }

  setTab(tab: 'field-types' | 'attribute') {
    this.selectedTab = tab;
  }

  addfield(field: any) {
    this.activeFields.push({
      ...field,
      label: field.name,
      value: '',
      selectedOptions: {},
      required: false
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
    this.selectedFormProperty = null;
  }

  selectFormProperty(property: 'title' | 'description') {
    this.selectedFormProperty = property;
    this.selectedFieldIndex = null;
  }

  setPreview(mode: 'phone' | 'tablet' | 'desktop') {
    this.previewMode = mode;
  }

  toggleRequiredField() {
    if (this.selectedFieldIndex !== null) {
      this.activeFields[this.selectedFieldIndex].required =
        !this.activeFields[this.selectedFieldIndex].required;
    }
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
  const formStructure = {
    formType: this.formType,
    title: this.formTitle,
    description: this.formDescription,
    fields: this.activeFields,
  };

  const currentTemplate = this.templateService.getTemplate();

  if (currentTemplate?.isEditMode) {
    const updatedTemplate: any = {
      ...currentTemplate,
      ...formStructure,
      type: 'single-page',
      id: currentTemplate.id
    };

    this.templateService.updateTemplate(updatedTemplate);
    alert(' Template updated successfully!');
  } else {
    const newTemplate: any = {
      ...formStructure,
      id: Date.now(),
      type: 'single-page'
    };

    this.templateService.updateTemplate(newTemplate);
    alert('New template saved successfully!');
  }

  this.router.navigate(['/formtemplates']);
}

  submitForm() {
    const submittedData: any = {};
    this.activeFields.forEach(field => {
      if (field.type === 'Check Box') {
        const selected = Object.keys(field.selectedOptions).filter(key => field.selectedOptions?.[key]);
        submittedData[field.label] = selected;
      } else {
        submittedData[field.label] = field.value || '';
      }
    });
    console.log('Form Submitted Data:', submittedData);
  }

  trackByIndex(index: number, item: any) {
    return index;
  }
}
