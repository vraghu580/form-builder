import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Template } from '../../template';

type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'url'
  | 'textarea'
  | 'checkbox'
  | 'dropdown'
  | 'radio';

export interface AttributeItem {
  icon: string;
  attributeName: string;
  attributeDiscription: string;
}

type BuilderNodeType = 'section' | 'subsection' | 'field';

interface BuilderField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  value?: string;
  options?: string[];
  selectedOptions?: string[];
}

@Component({
  selector: 'app-form-builder-page',
  standalone: false,
  templateUrl: './form-builder-page.html',
  styleUrl: './form-builder-page.scss'
})
export class FormBuilderPage implements OnInit {

  selectedTab: 'field-types' | 'attribute' = 'field-types';
  templateId!: number;
  selectedTemplate: any = null;

  selectedSection: any = null;
  selectedSubsection: any = null;
  selectedField: BuilderField | null = null;
  activeNodeType: BuilderNodeType | null = null;

  Attribute: AttributeItem[] = [
    { icon: 'bi-fonts', attributeName: 'Section', attributeDiscription: '' },
    { icon: 'bi-calculator', attributeName: 'Sub Section', attributeDiscription: '' },
  ];

  fieldTypes = [
    { type: 'text', icon: 'bi-fonts', name: 'Consumer Name', placeholder: 'Enter your name' },
    { type: 'number', icon: 'bi-hash', name: 'Consumer Id', placeholder: 'Enter a number' },
    { type: 'text', icon: 'bi-envelope', name: 'Address', placeholder: 'Enter your Address' },
    { type: 'number', icon: 'bi-telephone', name: 'Phone', placeholder: 'Enter phone number' },
    { type: 'number', icon: 'bi-link-45deg', name: 'Order No:', placeholder: 'Enter a Order No' },
    // { type: 'textarea', icon: 'bi-file-earmark-text', name: 'Text Area', placeholder: 'Enter description' },
    // { type: 'checkbox', icon: 'bi-check-square', name: 'Checkbox', options: ['Option A', 'Option B'] },
    // { type: 'dropdown', icon: 'bi-caret-down-square', name: 'Dropdown', options: ['Option X', 'Option Y', 'Option Z'] },
    // { type: 'radio', icon: 'bi-record-circle', name: 'Radio Button', options: ['Option 1', 'Option 2'] },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templateService: Template
  ) {}

  setTab(tab: 'field-types' | 'attribute') {
    this.selectedTab = tab;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.templateId = id ? +id : NaN;
    this.selectedTemplate = this.templateService.getTemplate();

    if (this.selectedTemplate) {
      if (!Array.isArray(this.selectedTemplate.sections)) {
        this.selectedTemplate.sections = [];
      }
      this.selectedTemplate.sections.forEach((section: any) => {
        section.fields = Array.isArray(section.fields) ? section.fields : [];
        section.subsections = Array.isArray(section.subsections) ? section.subsections : [];
        section.subsections.forEach((sub: any) => {
          sub.fields = Array.isArray(sub.fields) ? sub.fields : [];
        });
      });
    }
  }

  
  backToTemplates() {
    this.router.navigate(['/form', 'form-temp']);
  }

  selectSection(section: any) {
    this.selectedSection = section;
    this.selectedSubsection = null;
    this.selectedField = null;
    this.activeNodeType = 'section';
  }

  selectSubsection(sub: any, parentSection?: any) {
    if (parentSection) {
      this.selectedSection = parentSection;
    }
    this.selectedSubsection = sub;
    this.selectedField = null;
    this.activeNodeType = 'subsection';
  }

  selectField(f: BuilderField, parentSection: any, parentSub?: any) {
    this.selectedSection = parentSection;
    this.selectedSubsection = parentSub || null;
    this.selectedField = f;
    this.activeNodeType = 'field';
  }

addSection() {
  if (!this.selectedTemplate) return;
  const newSection = {
    id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
    title: 'New Section',
    fields: [] as BuilderField[],
    subsections: [] as any[],
  };
  this.selectedTemplate.sections.push(newSection);
  this.selectSection(newSection);
}

addSubsection() {
  if (!this.selectedSection) {
    alert('Select a Section first to add a Sub Section.');
    return;
  }
  const newSub = {
    id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
    title: 'New Sub Section',
    fields: [] as BuilderField[],
  };
  this.selectedSection.subsections.push(newSub);
  this.selectSubsection(newSub, this.selectedSection);
}


  addField(field: any) {
    if (!this.selectedSection && !this.selectedSubsection) {
      alert('Select a Section or Sub Section before adding a field.');
      return;
    }
    const newField: BuilderField = {
      id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
      type: field.type as FieldType,
      label: field.name,
      placeholder: field.placeholder || '',
      value: '',
      options: field.options || [],
      selectedOptions: [],
    };
    if (this.selectedSubsection) {
      this.selectedSubsection.fields.push(newField);
      this.selectField(newField, this.selectedSection, this.selectedSubsection);
    } else {
      this.selectedSection.fields.push(newField);
      this.selectField(newField, this.selectedSection);
    }
  }

removeField(container: { fields: BuilderField[] }, fieldId: string, ev?: MouseEvent) {
  if (ev) ev.stopPropagation();
  container.fields = (container.fields || []).filter(f => f.id !== fieldId);

  if (this.selectedField?.id === fieldId) {
    this.selectedField = null;
    this.activeNodeType = this.selectedSubsection ? 'subsection' : 'section';
  }
}

  updateSectionTitle(val: string) {
    if (this.selectedSection) this.selectedSection.title = val;
  }

  updateSubTitle(val: string) {
    if (this.selectedSubsection) this.selectedSubsection.title = val;
  }

  updateFieldLabel(val: string) {
    if (this.selectedField) this.selectedField.label = val;
  }

  updateFieldPlaceholder(val: string) {
    if (this.selectedField) this.selectedField.placeholder = val;
  }

  updateOptionsCSV(val: string) {
    if (this.selectedField) {
      this.selectedField.options = val
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    }
  }

  getOptionsCSV(): string {
    return (this.selectedField?.options || []).join(', ');
  }

deleteSection(sectionId: string) {
  if (!this.selectedTemplate?.sections) return;
  const idx = this.selectedTemplate.sections.findIndex((s: any) => s.id === sectionId);
  if (idx > -1) {
    const deletingSelectedSection =
      this.selectedSection && this.selectedSection.id === sectionId;
    if (deletingSelectedSection) {
      this.selectedSection = null;
      this.selectedSubsection = null;
      this.selectedField = null;
      this.activeNodeType = null;
    }
    this.selectedTemplate.sections.splice(idx, 1);
  }
}

deleteSubsection(parentSectionId: string, subId: string) {
  const parent = this.selectedTemplate?.sections?.find((s: any) => s.id === parentSectionId);
  if (!parent) return;
  const idx = parent.subsections.findIndex((sub: any) => sub.id === subId);
  if (idx > -1) {
    const deletingSelectedSub =
      this.selectedSubsection && this.selectedSubsection.id === subId;
    if (deletingSelectedSub) {
      this.selectedSubsection = null;
      this.selectedField = null;
      this.activeNodeType = this.selectedSection ? 'section' : null;
    }
    parent.subsections.splice(idx, 1);
  }
}

}

