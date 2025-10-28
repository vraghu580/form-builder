import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataEngineMain } from './components/data-engine-main/data-engine-main';
import { ConnectManageSource } from './components/connect-manage-source/connect-manage-source';
import { DataSchema } from './components/data-schema/data-schema';
import { DataEngineRoutingModule } from './data-engine-routing-module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Formbuilder } from './formbuilder/formbuilder';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DataEngineMain,
    ConnectManageSource,
    DataSchema,
    Formbuilder
  ],
  imports: [
    CommonModule,
    DataEngineRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    
  ]
})
export class DataEngineModule { }
