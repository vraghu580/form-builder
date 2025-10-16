import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SinglePageForm } from './single-page-form/single-page-form';
import { MultiStepForm } from './multi-step-form/multi-step-form';
import { Home } from './home/home';
import { ConnectorForm } from './connector-form/connector-form';

const routes: Routes = [
  {path : 'home', component: Home},
  {path : '', redirectTo: 'home', pathMatch: 'full' },
  {path : 'single-form/:id', component: SinglePageForm},
  {path : 'multi-form/:id', component: MultiStepForm },
  {path : 'connector-form', component: ConnectorForm},
  {
    path: 'form',
    loadChildren: () =>
      import('./form/form-module').then(m => m.FormModule),
  },
  {
    path: 'data-engine',
    loadChildren: () =>
      import('./data-engine/data-engine-module').then(m => m.DataEngineModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
