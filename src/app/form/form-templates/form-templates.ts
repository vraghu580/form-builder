import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Template, FormTemplate } from '../../services/template';
import { TemplatePreviewDialog } from '../../dialogs/template-preview-dialog/template-preview-dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-templates',
  standalone: false,
  templateUrl: './form-templates.html',
  styleUrl: './form-templates.scss'
})
export class FormTemplates implements OnDestroy {
  private templateUpdateSub?: Subscription;

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
        { label: 'Name', type: 'text' },
        { label: 'Phone', type: 'number' },
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
          section: 'Address Details',
          fields: [
            { label: 'Address', type: 'text' },
            { label: 'Street', type: 'text' },
            { label: 'Colony', type: 'textarea' }
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
            }
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

  constructor(private router: Router, private template: Template, private dialog: MatDialog) {

    // ✅ FIX: Subscribe to update or new template and update list live
    this.templateUpdateSub = this.template.onTemplateUpdate().subscribe((updatedTemplate) => {
      if (!updatedTemplate?.id) return;

      const idx = this.templates.findIndex(t => t.id === updatedTemplate.id);

      if (idx !== -1) {
        // update existing
        this.templates[idx] = { ...this.templates[idx], ...updatedTemplate };
        console.log('✅ Template updated:', this.templates[idx]);
      } else {
        // add new
        this.templates.push({ ...updatedTemplate });
        console.log('✅ New template added:', updatedTemplate);
      }
    });
  }

  openPreviewDialog(template: FormTemplate): void {
    console.log('Opening preview for:', template.title);
    this.dialog.open(TemplatePreviewDialog, {
      width: '650px',
      data: template
    });
  }

  openTemplate(templateId: number, mode: 'edit' | 'new' = 'new') {
    const selectedTemplate = this.templates.find(t => t.id === templateId);
    if (!selectedTemplate) return;

    const templateToPass: FormTemplate =
      mode === 'edit'
        ? { ...selectedTemplate, isEditMode: true, type: selectedTemplate.type }
        : {
            ...selectedTemplate,
            id: Date.now(),
            title: selectedTemplate.title + ' (Copy)',
            isEditMode: false,
            type: selectedTemplate.type || 'single-page'
          };

    // ✅ FIX: Store selected template in service before navigating
    this.template.setTemplate(templateToPass);

    // ✅ FIX: Navigate based on type
    switch (templateToPass.type) {
      case 'single-page':
        this.router.navigate(['/single-form', templateToPass.id]);
        break;
      case 'multi-page':
        this.router.navigate(['/multi-form', templateToPass.id]);
        break;
      case 'form-page':
        this.router.navigate(['/form/form-page', templateToPass.id]);
        break;
      default:
        console.error('Unknown form type:', templateToPass.type);
        break;
    }
  }

  exit() {
    this.router.navigate(['/formtemplates']);
  }

  ngOnDestroy() {
    this.templateUpdateSub?.unsubscribe();
  }
}
