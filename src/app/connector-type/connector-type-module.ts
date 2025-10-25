import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectorTypeRoutingModule } from './connector-type-routing-module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { GetConnectorType } from './get-connector-type/get-connector-type';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';



@NgModule({
  declarations: [
  
  GetConnectorType,
  
  ],
  imports: [
    CommonModule,
    ConnectorTypeRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
   MatTableModule,
   MatButtonModule ,
   MatPaginatorModule,
   MatSortModule
  ],
   providers: [
    provideHttpClient((withFetch())),
  ],
})
export class ConnectorTypeModule { }
