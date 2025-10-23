import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface FormField {
  label: string;
  type: string;
  options?: string[];
  placeholder?: string;
  value?: string;
  selectedOptions?: { [key: string]: boolean };
  required?: boolean;
}

export interface FormSubSection {
  subsection: string;
  fields: FormField[];
}

export interface FormSection {
  section: string;
  fields?: FormField[];
  subsections?: FormSubSection[];
}

export interface FormTemplate {
  id: number;
  title: string;
  description: string;
  type: string;
  fields?: FormField[];
  sections?: FormSection[];
  isEditMode?: boolean;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Template {
  private selectedTemplateSource = new BehaviorSubject<FormTemplate | null>(null);
  selectedTemplate$ = this.selectedTemplateSource.asObservable();

  private templateUpdateSubject = new Subject<FormTemplate>();
  private templates: FormTemplate[] = [];

  constructor() {
    // Load templates from localStorage
    const saved = localStorage.getItem('templates');
    if (saved) {
      this.templates = JSON.parse(saved);
    }
  }

  setTemplate(template: FormTemplate) {
    this.selectedTemplateSource.next(template);
  }

  getTemplate(): FormTemplate | null {
    return this.selectedTemplateSource.getValue();
  }

  clearTemplate() {
    this.selectedTemplateSource.next(null);
  }

  notifyTemplateUpdate(template: FormTemplate) {
    this.templateUpdateSubject.next(template);
  }

  onTemplateUpdate() {
    return this.templateUpdateSubject.asObservable();
  }

  updateTemplate(template: FormTemplate) {
    const idx = this.templates.findIndex(t => t.id === template.id);
    if (idx !== -1) {
      this.templates[idx] = template; // update existing
    } else {
      this.templates.push(template); // add new
    }

    // Save to localStorage
    localStorage.setItem('templates', JSON.stringify(this.templates));
    this.notifyTemplateUpdate(template);
  }

  getAllTemplates() {
    return this.templates;
  }
}
