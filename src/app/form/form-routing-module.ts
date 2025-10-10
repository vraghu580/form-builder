import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormTemplates } from './form-templates/form-templates';
import { FormPage } from './form-page/form-page';

const routes: Routes = [
  {path: 'form-temp', component: FormTemplates},
  {path: 'form-page/:id', component: FormPage},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormRoutingModule { }
