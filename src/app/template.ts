import { Injectable } from '@angular/core';

export interface FormTemplate {
  id: number;
  title: string;
  category?: string;
  description: string;
  sections: Array<{
    title: string;
    subsections: Array<{
      title: string;
      fields: Array<{
        label: string;
        type: string;
        options?: string[];
      }>;
    }>;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class Template {
   private selectedTemplate: any = null;

  // Store selected template
  setTemplate(template: any) {
    this.selectedTemplate = template;
  }

  // Retrieve selected template
  getTemplate() {
    return this.selectedTemplate;
  }

  // Optional: clear template
  clearTemplate() {
    this.selectedTemplate = null;
  }
  
}
