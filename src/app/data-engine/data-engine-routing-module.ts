import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectManageSource } from './components/connect-manage-source/connect-manage-source';
import { DataEngineMain } from './components/data-engine-main/data-engine-main';
import { DataSchema } from './components/data-schema/data-schema';

const routes: Routes = [
  {path : 'connect-manage', component: ConnectManageSource},
  {path : 'data-engine', component: DataEngineMain},
  {path : 'data-schema', component: DataSchema}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataEngineRoutingModule { }
