import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectManageSource } from './components/connect-manage-source/connect-manage-source';
import { DataEngineMain } from './components/data-engine-main/data-engine-main';
import { DataSchema } from './components/data-schema/data-schema';

const routes: Routes = [

  {
    path: '', component: DataEngineMain,
     data:{
        title:'Data Engine',
        icon:'bi bi-database-fill',
      },
    children: [
      { path: '', redirectTo: 'grievance-queue', pathMatch: 'full' },
      { path: 'connect-manage', component: ConnectManageSource,
         data:{
        title:'Data Engine',
        icon:'bi bi-database-fill',
      },
       },
      { path: 'data-schema', component: DataSchema,
         data:{
        title:'DataEngine',
        icon:'bi bi-database-fill',
      },
       },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataEngineRoutingModule { }
