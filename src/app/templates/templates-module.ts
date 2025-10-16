import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateList } from './template-list/template-list';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
  declarations: [TemplateList],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:  [TemplateList]
})
export class TemplatesModule { }
