import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormTemplates } from './form-templates/form-templates';
import { FormPage } from './form-page/form-page';
import { FormBuilderPage } from './form-builder-page/form-builder-page';

const routes: Routes = [
  {path: 'form-temp', component: FormTemplates,
    data:{
        title:'Choose Template Form',
        icon:'bi bi-ui-checks-grid',
      },
  },
  {path: 'form-page/:id', component: FormPage,},
  {path: 'form-buider', component: FormBuilderPage}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormRoutingModule { }
