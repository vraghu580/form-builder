import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Template } from '../../services/template';

export interface FormField {
  id?: string;
  type: string;
  icon?: string;
  name?: string;
  placeholder?: string;
  options?: string[];
  label?: string;
  value?: any;
  selectedOptions?: { [key: string]: boolean };
  required?: boolean;
}

export interface AttributeItem {
  icon: string;
  attributeName: string;
  attributeDiscription: string;
}

export interface SubSectionItem {
  id: string;
  title: string;
  fields: FormField[];
}

export interface SectionItem {
  id: string;
  itemType: 'section';
  title: string;
  subsections: SubSectionItem[];
  fields: FormField[];
}

export interface FormStructure {
  title: string;
  description: string;
  fields: any[];
  formType?: string;
}

@Component({
  selector: 'app-form-page',
  standalone: false,
  templateUrl: './form-page.html',
  styleUrls: ['./form-page.scss'],
})
export class FormPage {


  activeFields: any[] = [];

  selectedEntityType: 'field' | 'section' | 'subsection' | null = null;
  selectedEntityRef: any = null;
  selectedFieldIndex: number | null = null;

  selectedParentSectionIndex: number | null = null;
  selectedParentSubsectionIndex: number | null = null;

  isValidationEnabled = false;
  selectedTab: 'sections' | 'attribute' = 'sections';
  selectedFormProperty: 'title' | 'description' | null = null;

  formTitle = 'Form Title';
  formDescription = 'Form description goes here';
  formType: string = '';
  structuredFields: any[] = [];

  fieldTypes: FormField[] = [
    { type: 'text', name: 'Consumer Name', placeholder: 'Enter your name' },
    { type: 'number', name: 'Consumer Id', placeholder: 'Enter a number' },
    { type: 'text', name: 'Address', placeholder: 'Enter your Address' },
    { type: 'number', name: 'Phone', placeholder: 'Enter phone number' },
    { type: 'number', name: 'Order No:', placeholder: 'Enter a Order No' },
    { type: 'Check Box', name: 'Checkbox', options: ['Option A', 'Option B'] },
    { type: 'dropdown', name: 'Dropdown', placeholder: 'Select option', options: ['Option X', 'Option Y', 'Option Z'] },
    { type: 'radio', name: 'Radio Button', options: ['Option 1', 'Option 2'] }
  ];

  Attribute: AttributeItem[] = [
    { icon: 'bi-folder', attributeName: 'Section', attributeDiscription: 'Create a new section' },
    { icon: 'bi-diagram-3', attributeName: 'Sub Section', attributeDiscription: 'Add a sub section to a section' },
  ];

  attributeTypes = [
    { label: 'Text', value: 'text' },
    { label: 'Number', value: 'number' },
    { label: 'Email', value: 'email' },
    { label: 'Date', value: 'date' },
    { label: 'Checkbox', value: 'Check Box' },
    { label: 'Radio', value: 'radio' },
    { label: 'Dropdown', value: 'dropdown' },
    { label: 'Textarea', value: 'textarea' },
    { label: 'Password', value: 'password' },
    { label: 'Tel', value: 'tel' },
    { label: 'URL', value: 'url' },
    { label: 'Time', value: 'time' },
    { label: 'Datetime Local', value: 'datetime-local' },
    { label: 'File', value: 'file' },
    { label: 'Range', value: 'range' },
    { label: 'Color', value: 'color' }
  ];

  constructor(private templateService: Template, private router: Router) { }

  ngOnInit() {
    const selectedTemplate = this.templateService.getTemplate();

    if (selectedTemplate) {
      this.formTitle = selectedTemplate.title || 'Form Title';
      this.formDescription = selectedTemplate.description || 'Form description goes here';
      this.formType = selectedTemplate.type || 'unknown';

      if (selectedTemplate.sections && selectedTemplate.sections.length > 0) {
        this.activeFields = selectedTemplate.sections.map((section: any) => ({
          itemType: 'section',
          title: section.section || 'Untitled Section',
          fields: (section.fields || []).map((f: any) => ({
            label: f.label,
            type: f.type,
            placeholder: f.label,
            value: '',
            required: false,
            options: f.options || []
          })),
          subsections: (section.subsections || []).map((sub: any) => ({
            title: sub.subsection || 'Untitled Subsection',
            fields: (sub.fields || []).map((sf: any) => ({
              label: sf.label,
              type: sf.type,
              placeholder: sf.label,
              value: '',
              required: false,
              options: sf.options || []
            }))
          }))
        }));
      }

    }
  }

  private generateId(prefix = '') {
    return prefix + (crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2));
  }

  setTab(tab: 'sections' | 'attribute') {
    this.selectedTab = tab;
  }

  handleAttributeClick(attr: AttributeItem) {
    if (attr.attributeName === 'Section') {
      this.addSection();
    } else if (attr.attributeName === 'Sub Section') {
      this.addSubSection();
    }
  }

  addSection() {
    const section: SectionItem = {
      id: this.generateId('sec-'),
      itemType: 'section',
      title: 'New Section',
      subsections: [],
      fields: []
    };
    this.activeFields.push(section);
    this.selectSection(this.activeFields.length - 1);
  }

  addSubSection() {
    if (this.selectedEntityType === 'section' && this.selectedParentSectionIndex !== null) {
      const sectionIndex = this.selectedParentSectionIndex;
      const subsection: SubSectionItem = {
        id: this.generateId('sub-'),
        title: 'New Sub Section',
        fields: []
      };
      (this.activeFields[sectionIndex] as SectionItem).subsections.push(subsection);
      this.selectSubsection(sectionIndex, (this.activeFields[sectionIndex] as SectionItem).subsections.length - 1);
      return;
    }

    const section: SectionItem = {
      id: this.generateId('sec-'),
      itemType: 'section',
      title: 'New Section',
      subsections: [],
      fields: []
    };
    const subsection: SubSectionItem = {
      id: this.generateId('sub-'),
      title: 'New Sub Section',
      fields: []
    };
    section.subsections.push(subsection);
    this.activeFields.push(section);
    this.selectSubsection(this.activeFields.length - 1, 0);
  }

  addfield(field: any) {
    const newField: FormField = {
      ...field,
      id: this.generateId('fld-'),
      label: field.name,
      value: '',
      selectedOptions: {},
      required: false,
      options: Array.isArray(field.options) ? [...field.options] : undefined
    };

    if (this.selectedEntityType === 'subsection' && this.selectedParentSectionIndex !== null && this.selectedParentSubsectionIndex !== null) {
      const parentSection = this.activeFields[this.selectedParentSectionIndex] as SectionItem;
      parentSection.subsections[this.selectedParentSubsectionIndex].fields.push(newField);
      return;
    }

    if (this.selectedEntityType === 'section' && this.selectedParentSectionIndex !== null) {
      const section = this.activeFields[this.selectedParentSectionIndex] as SectionItem;
      section.fields.push(newField);
      // no auto-select
      return;
    }

    this.activeFields.push(newField);
  }

  removeField(index: number) {
    this.activeFields.splice(index, 1);
    if (this.selectedEntityType === 'section' && this.selectedParentSectionIndex === index) {
      this.clearSelection();
    }
    if (this.selectedEntityType === 'field' && this.selectedFieldIndex === index) {
      this.clearSelection();
    }
  }

  removeNestedField(sectionIndex: number, fieldIndex: number) {
    const section = this.activeFields[sectionIndex] as SectionItem;
    if (!section) return;
    section.fields.splice(fieldIndex, 1);
    this.clearSelection();
  }

  removeNestedFieldInSub(sectionIndex: number, subIndex: number, fieldIndex: number) {
    const section = this.activeFields[sectionIndex] as SectionItem;
    if (!section) return;
    section.subsections[subIndex].fields.splice(fieldIndex, 1);
    this.clearSelection();
  }

  clearSelection() {
    this.selectedEntityType = null;
    this.selectedEntityRef = null;
    this.selectedFieldIndex = null;
    this.selectedParentSectionIndex = null;
    this.selectedParentSubsectionIndex = null;
    this.selectedFormProperty = null;
  }

  selectField(index: number) {
    const item = this.activeFields[index];
    if (!item) return;
    if (item.itemType === 'section') {
      this.selectSection(index);
      return;
    }
    this.selectedEntityType = 'field';
    this.selectedEntityRef = item;
    this.selectedFieldIndex = index;
    this.selectedParentSectionIndex = null;
    this.selectedParentSubsectionIndex = null;
    this.selectedFormProperty = null;
  }

  selectSection(sectionIndex: number) {
    const sec = this.activeFields[sectionIndex];
    if (!sec || sec.itemType !== 'section') return;
    this.selectedEntityType = 'section';
    this.selectedEntityRef = sec;
    this.selectedParentSectionIndex = sectionIndex;
    this.selectedParentSubsectionIndex = null;
    this.selectedFieldIndex = null;
    this.selectedFormProperty = null;
  }

  selectSubsection(sectionIndex: number, subsectionIndex: number) {
    const sec = this.activeFields[sectionIndex] as SectionItem;
    if (!sec) return;
    const sub = sec.subsections[subsectionIndex];
    if (!sub) return;
    this.selectedEntityType = 'subsection';
    this.selectedEntityRef = sub;
    this.selectedParentSectionIndex = sectionIndex;
    this.selectedParentSubsectionIndex = subsectionIndex;
    this.selectedFieldIndex = null;
    this.selectedFormProperty = null;
  }

  selectNestedField(sectionIndex: number, fieldIndex: number) {
    const sec = this.activeFields[sectionIndex] as SectionItem;
    if (!sec) return;
    const f = sec.fields[fieldIndex];
    if (!f) return;
    this.selectedEntityType = 'field';
    this.selectedEntityRef = f;
    this.selectedParentSectionIndex = sectionIndex;
    this.selectedParentSubsectionIndex = null;
    this.selectedFieldIndex = null;
    this.selectedFormProperty = null;
  }

  selectNestedFieldInSub(sectionIndex: number, subIndex: number, fieldIndex: number) {
    const sec = this.activeFields[sectionIndex] as SectionItem;
    if (!sec) return;
    const sub = sec.subsections[subIndex];
    if (!sub) return;
    const f = sub.fields[fieldIndex];
    if (!f) return;
    this.selectedEntityType = 'field';
    this.selectedEntityRef = f;
    this.selectedParentSectionIndex = sectionIndex;
    this.selectedParentSubsectionIndex = subIndex;
    this.selectedFieldIndex = null;
    this.selectedFormProperty = null;
  }

  selectFormProperty(property: 'title' | 'description') {
    this.selectedFormProperty = property;
    this.selectedEntityType = null;
    this.selectedEntityRef = null;
    this.selectedFieldIndex = null;
    this.selectedParentSectionIndex = null;
    this.selectedParentSubsectionIndex = null;
  }

  toggleRequiredField() {
    if (this.selectedEntityType === 'field' && this.selectedEntityRef) {
      this.selectedEntityRef.required = !this.selectedEntityRef.required;
    }
  }

  addOption() {
    if (this.selectedEntityType === 'field' && this.selectedEntityRef) {
      if (!Array.isArray(this.selectedEntityRef.options)) this.selectedEntityRef.options = [];
      this.selectedEntityRef.options.push('New Option');
    }
  }

  removeOption(i: number) {
    if (this.selectedEntityType === 'field' && this.selectedEntityRef && Array.isArray(this.selectedEntityRef.options)) {
      this.selectedEntityRef.options.splice(i, 1);
    }
  }

  saveForm() {
    const formStructure: FormStructure = {
      formType: this.formType,
      title: this.formTitle,
      description: this.formDescription,
      fields: this.activeFields
    };
    console.log('💾 Form Structure:', JSON.stringify(formStructure, null, 2));
  }

  submitForm() {
    const submittedData: any = {};

    this.activeFields.forEach(item => {
      if (item?.itemType === 'section') {
        submittedData[item.title] = item;
      } else {
        if (item.type === 'Check Box') {
          const selected = Object.keys(item.selectedOptions || {}).filter(k => item.selectedOptions?.[k]);
          submittedData[item.label] = selected;
        } else {
          submittedData[item.label] = item.value || '';
        }
      }
    });

    console.log('✅ Form Submitted Data:', submittedData);
  }

  trackByIndex(index: number, item: any) {
    return item?.id ?? index;
  }
}
