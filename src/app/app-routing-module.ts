import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SinglePageForm } from './single-page-form/single-page-form';
import { MultiStepForm } from './multi-step-form/multi-step-form';

const routes: Routes = [
  {path : 'single-form', component: SinglePageForm},
  {path : 'multi-form', component: MultiStepForm }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
