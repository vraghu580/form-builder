import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Template } from '../../template';

export interface FormField {
  label: string;
  type: string;
}

export interface FormSubSection {
  subsection?: string;
  fields?: FormField[];
}

export interface FormSection {
  section?: string;
  fields?:FormField[];
  subsections?: FormSubSection[];
}

export interface FormTemplate {
  id: number;
  title: string;
  description: string;
  type: string;
  sections?: FormSection[];
  fields?:FormField[];
}

@Component({
  selector: 'app-form-templates',
  standalone: false,
  templateUrl: './form-templates.html',
  styleUrl: './form-templates.scss'
})
export class FormTemplates {
  constructor(private router: Router, private template: Template,) {}

  templates: FormTemplate[] = [
    {
      id: 1,
      title: 'Employee Onboarding Form',
      type: 'single-page',
      description: 'Collect personal and job-related details of new employees.',
      
              fields: [
                { label: 'Full Name', type: 'text' },
                { label: 'Email ID', type: 'email' },
                { label: 'Date of Joining', type: 'date' }
              ]
    },
    {
      id: 2,
      title: 'Address Information',
      description: 'Template for permanent and temporary address details.',
      type: 'single-page',
              fields: [
                { label: 'Name', type: 'text'},
                { label: 'Phone', type: 'number'},
                { label: 'Address', type: 'text' },
                { label: 'City', type: 'text' },
                { label: 'Country', type: 'dropdown' }
              ]
    },
    {
      id: 3,
      title: 'Water Connection Form',
      description: 'For customers requesting new or reconnection of water service.',
      type: 'multi-page',
      sections: [
        {
          section: 'Connection Details',
          subsections: [
            {
              subsection: 'Customer Info',
              fields: [
                { label: 'Applicant Name', type: 'text' },
                { label: 'Contact Number', type: 'text' },
                { label: 'Connection Type', type: 'dropdown' }
              ]
            },
            {
              subsection: 'Current Address',
              fields: [
                { label: 'House Number', type: 'text' },
                { label: 'Street', type: 'text' },
                { label: 'Zone', type: 'dropdown' }
              ]
            },
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Exchange Request Form',
      description: 'Used for product exchange or service replacement requests.',
      type: 'multi-page',
      sections: [
        {
          section: 'Product Information',
          subsections: [
            {
              subsection: 'Product Details',
              fields: [
                { label: 'Product Name', type: 'text' },
                { label: 'Purchase Date', type: 'date' },
                { label: 'Reason for Exchange', type: 'textarea' }
              ]
            },
            {
              subsection: 'Address',
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
  description: 'Template for processing customer product return requests.',
  type: 'form-page',
  sections: [
    {
      section: 'Order Details',
      fields: [
        { label: 'Order No', type: 'text' },
        { label: 'Product type', type: 'text' },
        { label: 'Reason for Return', type: 'textarea' }
      ],
      subsections: [
        {
          subsection: 'Return Info',
          fields: [
            { label: 'Order ID', type: 'text' },
            { label: 'Product Name', type: 'text' },
            { label: 'Reason for Return', type: 'textarea' }
          ]
        },
        {
          subsection: 'Current Address',
          fields: [
            { label: 'House Number', type: 'text' },
            { label: 'Street', type: 'text' },
            { label: 'Zone', type: 'dropdown' }
          ]
        },
        {
          subsection: 'Permanent Address',
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
      id: 6,
      title: 'New Application Form',
      description: 'Used for applying new services, connections, or ID requests.',
      type: 'form-page',
      sections: [
        {
          section: 'Applicant Details',
          subsections: [
            {
              subsection: 'Personal Info',
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
