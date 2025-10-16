import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectorForm } from './connector-form/connector-form';
import { GetConnectorType } from './get-connector-type/get-connector-type';
import { EditConnectorType } from './edit-connector-type/edit-connector-type';

const routes: Routes = [
  {path: 'connector-form', component: ConnectorForm},
  {path: 'connector-get', component: GetConnectorType},
  {path: 'Connector-edit', component: EditConnectorType},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConnectorTypeRoutingModule { }
