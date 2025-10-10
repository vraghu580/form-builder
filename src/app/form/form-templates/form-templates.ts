import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Template } from '../../template';

export interface FormField {
  label: string;
  type: string;
}

export interface FormSubSection {
  title: string;
  fields: FormField[];
}

export interface FormSection {
  title: string;
  subsections: FormSubSection[];
}

export interface FormTemplate {
  id: number;
  title: string;
  category: string;
  description: string;
  type?: string;
  sections: FormSection[];
}

@Component({
  selector: 'app-form-templates',
  standalone: false,
  templateUrl: './form-templates.html',
  styleUrl: './form-templates.scss'
})
export class FormTemplates {
  constructor(private router: Router, private template: Template) {}

  // ✅ Full templates list
  templates: FormTemplate[] = [
    {
      id: 1,
      title: 'Employee Onboarding Form',
      category: 'HR Template',
      description: 'Collect personal and job-related details of new employees.',
      type: 'single-page',
      sections: [
        {
          title: 'Personal Details',
          subsections: [
            {
              title: 'Basic Info',
              fields: [
                { label: 'Full Name', type: 'text' },
                { label: 'Email ID', type: 'email' },
                { label: 'Date of Joining', type: 'date' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Address Information',
      category: 'General Template',
      description: 'Template for permanent and temporary address details.',
      type: 'single-page',
      sections: [
        {
          title: 'Address Details',
          subsections: [
            {
              title: 'Permanent Address',
              fields: [
                { label: 'Address Line 1', type: 'text' },
                { label: 'City', type: 'text' },
                { label: 'Country', type: 'dropdown' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Water Connection Form',
      category: 'Utility Template',
      description: 'For customers requesting new or reconnection of water service.',
      type: 'multi-page',
      sections: [
        {
          title: 'Connection Details',
          subsections: [
            {
              title: 'Customer Info',
              fields: [
                { label: 'Applicant Name', type: 'text' },
                { label: 'Contact Number', type: 'text' },
                { label: 'Connection Type', type: 'dropdown' }
              ]
            },
            {
              title: 'Address',
              fields: [
                { label: 'House Number', type: 'text' },
                { label: 'Street', type: 'text' },
                { label: 'Zone', type: 'dropdown' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Exchange Request Form',
      category: 'Service Template',
      description: 'Used for product exchange or service replacement requests.',
      type: 'multi-page',
      sections: [
        {
          title: 'Product Information',
          subsections: [
            {
              title: 'Product Details',
              fields: [
                { label: 'Product Name', type: 'text' },
                { label: 'Purchase Date', type: 'date' },
                { label: 'Reason for Exchange', type: 'textarea' }
              ]
            },
            {
              title: 'Address',
              fields: [
                { label: 'House Number', type: 'text' },
                { label: 'Street', type: 'text' },
                { label: 'Zone', type: 'dropdown' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Return Request Form',
      category: 'E-commerce Template',
      description: 'Template for processing customer product return requests.',
      type: 'form-page',
      sections: [
        {
          title: 'Order Details',
          subsections: [
            {
              title: 'Return Info',
              fields: [
                { label: 'Order ID', type: 'text' },
                { label: 'Product Name', type: 'text' },
                { label: 'Reason for Return', type: 'textarea' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 6,
      title: 'New Application Form',
      category: 'General Template',
      description: 'Used for applying new services, connections, or ID requests.',
      type: 'form-page',
      sections: [
        {
          title: 'Applicant Details',
          subsections: [
            {
              title: 'Personal Info',
              fields: [
                { label: 'Applicant Name', type: 'text' },
                { label: 'Email', type: 'email' },
                { label: 'Phone Number', type: 'text' }
              ]
            }
          ]
        }
      ]
    }
  ];

  // ✅ Filtered arrays (avoids .filter() in HTML)
  // singlePageTemplates = this.templates.filter(t => t.type === 'single-page');
  // multiPageTemplates = this.templates.filter(t => t.type === 'multi-page');

 openTemplate(templateId: number) {
    const selectedTemplate = this.templates.find(t => t.id === templateId);

    if (!selectedTemplate) return;

    this.template.setTemplate(selectedTemplate);

    switch (selectedTemplate.type) {
      case 'single-page':
        this.router.navigate(['/single-form', templateId]);
        break;
      case 'multi-page':
        this.router.navigate(['/multi-form', templateId]);
        break;
      case 'form-page':
        this.router.navigate(['/form/form-page', templateId]);
        break;
      default:
        console.error('Unknown form type:', selectedTemplate.type);
        break;
    }
  }

  exit() {
    this.router.navigate(['/']);
  }
}
