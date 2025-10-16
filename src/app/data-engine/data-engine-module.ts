import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataEngineMain } from './components/data-engine-main/data-engine-main';
import { ConnectManageSource } from './components/connect-manage-source/connect-manage-source';
import { DataSchema } from './components/data-schema/data-schema';
import { DataEngineRoutingModule } from './data-engine-routing-module';



@NgModule({
  declarations: [
    DataEngineMain,
    ConnectManageSource,
    DataSchema
  ],
  imports: [
    CommonModule,
    DataEngineRoutingModule,
  ]
})
export class DataEngineModule { }
