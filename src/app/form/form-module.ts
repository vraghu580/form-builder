import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormTemplates } from './form-templates/form-templates';
import { FormRoutingModule } from './form-routing-module';
import { FormPage } from './form-page/form-page';
import { FormsModule } from '@angular/forms';
import { FormBuilderPage } from './form-builder-page/form-builder-page';



@NgModule({
  declarations: [
    FormTemplates,
    FormPage,
    FormBuilderPage
  ],
  imports: [
    CommonModule,
    FormRoutingModule,
    FormsModule
  ]
})
export class FormModule { }
