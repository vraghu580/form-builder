import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectorTypeRoutingModule } from './connector-type-routing-module';
import { ConnectorForm } from './connector-form/connector-form';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { GetConnectorType } from './get-connector-type/get-connector-type';



@NgModule({
  declarations: [
  ConnectorForm,
  GetConnectorType
  ],
  imports: [
    CommonModule,
    ConnectorTypeRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
   providers: [
    provideHttpClient((withFetch())),
  ],
})
export class ConnectorTypeModule { }
