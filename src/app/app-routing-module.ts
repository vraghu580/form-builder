import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SinglePageForm } from './single-page-form/single-page-form';
import { MultiStepForm } from './multi-step-form/multi-step-form';
import { Home } from './home/home';
import { ConnectorForm } from './connector-form/connector-form';
import { FormTemplates } from './form/form-templates/form-templates';
import { ConnectMysql } from './connect-mysql/connect-mysql';
import { connect } from 'http2';
import { ConnectToPostgresql } from './connect-to-postgresql/connect-to-postgresql';

const routes: Routes = [
  {path : 'home', component: Home},
  {path : '', redirectTo: 'home', pathMatch: 'full' },
  {path : 'single-form/:id', component: SinglePageForm},
  {path : 'multi-form/:id', component: MultiStepForm },
  {path : 'connector-form', component: ConnectorForm},
  {path:'formtemplates', component:FormTemplates},
{path:'connect-mysql',component:ConnectMysql},
{path:'connect-postgresql',component:ConnectToPostgresql},  
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
