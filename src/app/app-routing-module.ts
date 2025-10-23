import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SinglePageForm } from './single-page-form/single-page-form';
import { MultiStepForm } from './multi-step-form/multi-step-form';
import { Home } from './home/home';
import { ConnectorForm } from './connector-type/connector-form/connector-form';
import { ConnectMysql } from './connect-mysql/connect-mysql';
import { ConnectToPostgresql } from './connect-to-postgresql/connect-to-postgresql';
import { ConnectForm } from './connect-form/connect-form';

const routes: Routes = [
  { path: 'home', component: Home },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'single-form/:id', component: SinglePageForm },
  { path: 'multi-form/:id', component: MultiStepForm },
  {path:'connect-mysql',component:ConnectMysql},
  {path:'connect-postgresql',component:ConnectToPostgresql},
{path:'connect-form',component:ConnectForm},


  {
    path: 'form',
    loadChildren: () =>
      import('./form/form-module').then(m => m.FormModule),
  },
  {
    path: 'data-engine',
    loadChildren: () =>
      import('./data-engine/data-engine-module').then(m => m.DataEngineModule),
  },
  {
    path: 'connector-type',
    loadChildren: () =>
      import('./connector-type/connector-type-module').then(m => m.ConnectorTypeModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
