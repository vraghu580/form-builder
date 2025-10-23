import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectorTypeRoutingModule } from './connector-type-routing-module';
import { ConnectorForm } from './connector-form/connector-form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { GetConnectorType } from './get-connector-type/get-connector-type';
import { EditConnectorType } from './edit-connector-type/edit-connector-type';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';



@NgModule({
  declarations: [
  ConnectorForm,
  GetConnectorType,
  EditConnectorType
  ],
  imports: [
    CommonModule,
    ConnectorTypeRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
   MatTableModule,
   MatButtonModule ,
   MatPaginatorModule,
   MatSortModule,
   HttpClientModule,
   FormsModule,
   
  ],
   providers: [
    provideHttpClient((withFetch())),
  ],
})
export class ConnectorTypeModule { }
