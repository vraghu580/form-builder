import { Injectable } from '@angular/core';
import { Template } from './template.model';

@Injectable({ providedIn: 'root' })
export class TemplateService {
  private templates: Template[] = [
    {
      id: 't1',
      name: 'Job Application Form',
      description: 'Collect applicant details and experience info.',
      createdAt: new Date('2025-05-01'),
      fields: 8
    },
    {
      id: 't2',
      name: 'Customer Feedback',
      description: 'Simple feedback form for user satisfaction.',
      createdAt: new Date('2025-06-10'),
      fields: 5
    },
    {
      id: 't3',
      name: 'Survey Form',
      description: 'Multiple choice survey with comments section.',
      createdAt: new Date('2025-07-15'),
      fields: 10
    }
  ];

  getTemplates() {
    return this.templates;
  }
}
