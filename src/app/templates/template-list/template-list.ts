import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TemplateService } from '../template-list/template.service';
import { Template } from '../template-list/template.model';

@Component({
  selector: 'app-template-list',
  standalone: false,
  templateUrl: './template-list.html',
  styleUrl: './template-list.scss'
})
export class TemplateList implements OnInit {
templates: Template[] = [];

  constructor(private templateService: TemplateService, private router: Router) {}

  ngOnInit(): void {
    this.templates = this.templateService.getTemplates();
  }

  useTemplate(templateId: string) {
    // later we’ll navigate to the builder
    this.router.navigate(['/template-builder', templateId]);
  }
}