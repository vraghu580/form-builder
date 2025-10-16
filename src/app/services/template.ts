import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

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
  private selectedTemplateSource = new BehaviorSubject<any>(null);

   selectedTemplate$ = this.selectedTemplateSource.asObservable();

  setTemplate(template: any) {
    this.selectedTemplateSource.next(template);
  }

  getTemplate() {
    return this.selectedTemplateSource.getValue();
  }

  clearTemplate() {
    this.selectedTemplate = null;
  }
  
}
