import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Template } from '../services/template';

interface FieldType {
  label: string;
  type: string;
  icon: string;
}

interface Step {
  title: string;
  description?: string;
  fields: { label: string; type: string; value?: any; placeholder?: string; required?: boolean }[];
}

@Component({
  selector: 'app-multi-step-form',
  templateUrl: './multi-step-form.html',
  styleUrls: ['./multi-step-form.scss'],
  standalone: false,
})
export class MultiStepForm {
  saveAndResume = false;
  activeFields: any[] = [];

  fieldTypes: FieldType[] = [
    { label: 'Text', type: 'text', icon: 'bi-type' },
    { label: 'Email', type: 'email', icon: 'bi-envelope' },
    { label: 'Number', type: 'number', icon: 'bi-hash' },
    { label: 'Password', type: 'password', icon: 'bi-key' },
    { label: 'Date', type: 'date', icon: 'bi-calendar' },
    { label: 'Checkbox', type: 'checkbox', icon: 'bi-check2-square' },
    { label: 'Radio', type: 'radio', icon: 'bi-dot-circle' },
    { label: 'Select', type: 'select', icon: 'bi-caret-down-square' },
    { label: 'Textarea', type: 'textarea', icon: 'bi-card-text' },
    { label: 'File Upload', type: 'file', icon: 'bi-upload' }
  ];

  formTitle: string = 'Form Title';
  formDescription: string = 'Form description goes here';
  formType: string ='Single Page Form';

  activeTab: 'fields' | 'steps' = 'fields';
  steps: Step[] = [
    { title: 'Personal Information', description: 'Basic details about yourself', fields: [] }
  ];
  currentStep = 0;
  previewMode: 'web' | 'tablet' | 'mobile' = 'web';

  form: FormGroup;
  selectedFieldIndex: number | null = null;

  constructor(private fb: FormBuilder, private templateService: Template, private router: Router) {
    this.form = this.fb.group({
      steps: this.fb.array([this.fb.group({})])
    });
  }

  ngOnInit() {
    const selectedTemplate = this.templateService.getTemplate();

    if (selectedTemplate) {
      // this.formTitle = selectedTemplate.title || 'Form Title';
      // this.formDescription = selectedTemplate.description || 'Form description goes here';
      // this.formType = selectedTemplate.type || 'unknown';   

      if (selectedTemplate.sections && selectedTemplate.sections.length > 0) {
        selectedTemplate.sections.forEach((section: any) => {
          if (section.subsections && section.subsections.length > 0) {
            section.subsections.forEach((sub: any) => {
              if (sub.fields && sub.fields.length > 0) {
                sub.fields.forEach((field: any) => {
                  this.steps[this.currentStep].fields.push({
                    label: field.label,
                    type: field.type,
                    placeholder: field.label,
                    value: '',
                    required: false,
                  });
                });

              }
            });
          }
        });
      }
    }
  }
saveForm() {
  // Collect current values for each step from the reactive FormArray
  const stepsValues = this.stepsFormArray.controls.map((grp) => grp.value);

  const formStructure = {
    title: this.formTitle,
    description: this.formDescription,
    type: this.formType,
    steps: this.steps.map((step, si) => ({
      title: step.title,
      description: step.description,
      fields: step.fields.map((f) => ({
        label: f.label,
        type: f.type,
        placeholder: f.placeholder ?? '',
        required: !!f.required,
        value: stepsValues[si]?.[f.label] ?? null
      }))
    }))
  };

  console.log('💾 Form Structure:', JSON.stringify(formStructure, null, 2));
  // TODO: send to API if needed
}


  get stepsFormArray(): FormArray<FormGroup> {
    return this.form.get('steps') as FormArray<FormGroup>;
  }

  selectStep(i: number) {
    this.currentStep = i;
    this.selectedFieldIndex = null;
  }

  addStep() {
    const title = prompt('Enter step title:') || `Step ${this.steps.length + 1}`;
    this.steps.push({ title, fields: [] });
    this.stepsFormArray.push(this.fb.group({}));
    this.currentStep = this.steps.length - 1;
  }

  removeStep(i: number) {
    if (this.steps.length <= 1) return;
    this.steps.splice(i, 1);
    this.stepsFormArray.removeAt(i);
    if (this.currentStep >= this.steps.length) this.currentStep = this.steps.length - 1;
  }

  getUniqueLabel(base: string): string {
    const existing = this.steps[this.currentStep].fields.map(f => f.label);
    if (!existing.includes(base)) return base;
    let i = 2;
    while (existing.includes(`${base} ${i}`)) i++;
    return `${base} ${i}`;
  }

  addFieldToStep(field: FieldType) {
    const uniqueLabel = this.getUniqueLabel(field.label);
    const form = this.stepsFormArray.at(this.currentStep) as FormGroup;
    form.addControl(uniqueLabel, this.fb.control('', Validators.required));
    this.steps[this.currentStep].fields.push({ ...field, label: uniqueLabel, placeholder: '', required: true });
  }

  removeFieldFromStep(index: number) {
    const form = this.stepsFormArray.at(this.currentStep) as FormGroup;
    const label = this.steps[this.currentStep].fields[index].label;
    form.removeControl(label);
    this.steps[this.currentStep].fields.splice(index, 1);
    this.selectedFieldIndex = null;
  }

  selectField(index: number) {
    this.selectedFieldIndex = index;
  }

  updateFieldLabel(event: any) {
    if (this.selectedFieldIndex === null) return;
    const newLabel = event.target.value.trim();
    if (!newLabel) return;

    const step = this.steps[this.currentStep];
    const field = step.fields[this.selectedFieldIndex];
    const form = this.stepsFormArray.at(this.currentStep) as FormGroup;

    const oldLabel = field.label;
    const control = form.get(oldLabel);
    if (control) {
      form.removeControl(oldLabel);
      form.addControl(newLabel, control);
    }

    field.label = newLabel;
  }

  updatePlaceholder(event: any) {
    if (this.selectedFieldIndex === null) return;
    this.steps[this.currentStep].fields[this.selectedFieldIndex].placeholder = event.target.value;
  }

  toggleRequired() {
    if (this.selectedFieldIndex === null) return;
    const field = this.steps[this.currentStep].fields[this.selectedFieldIndex];
    const form = this.stepsFormArray.at(this.currentStep) as FormGroup;
    const control = form.get(field.label);

    if (!control) return;

    field.required = !field.required;
    if (field.required) {
      control.addValidators(Validators.required);
    } else {
      control.clearValidators();
    }
    control.updateValueAndValidity();
  }

  previousStep() {
    if (this.currentStep > 0) this.currentStep--;
    this.selectedFieldIndex = null;
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) this.currentStep++;
    this.selectedFieldIndex = null;
  }

  setPreviewMode(mode: 'web' | 'tablet' | 'mobile') {
    this.previewMode = mode;
  }

  submitForm() {
    const formSchema = {
      steps: this.steps.map(step => ({
        title: step.title,
        description: step.description,
        fields: step.fields.map(f => ({
          label: f.label,
          type: f.type,
          placeholder: f.placeholder,
          required: f.required
        }))
      }))
    };

    console.log('Form Schema:', JSON.stringify(formSchema, null, 2));
    alert('✅ Form schema generated! Check console for details.');
  }
}
