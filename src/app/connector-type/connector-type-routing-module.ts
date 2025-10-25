import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetConnectorType } from './get-connector-type/get-connector-type';

const routes: Routes = [
  {path: 'connector-get', component: GetConnectorType,
     data:{
        title:'Connector Types',
        icon:'bi bi-filetype-tsx',
      },
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConnectorTypeRoutingModule { }
