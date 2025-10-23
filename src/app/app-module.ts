import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MultiStepForm } from './multi-step-form/multi-step-form';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Home } from './home/home';
import { SinglePageForm } from './single-page-form/single-page-form';
import { MatButtonModule } from '@angular/material/button';
import { TemplatePreviewDialog } from './dialogs/template-preview-dialog/template-preview-dialog';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { ConfirmationDialogBox } from './components/confirmation-dialog-box/confirmation-dialog-box';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConnectorTypeMetadataschemaView } from './components/dialog/connector-type-metadataschema-view/connector-type-metadataschema-view';
import { ConnectToPostgresql } from './connect-to-postgresql/connect-to-postgresql';
import { ConnectMysql } from './connect-mysql/connect-mysql';
import { ConnectForm } from './connect-form/connect-form';
import { MatIconModule } from '@angular/material/icon';
import {  MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    App,
    MultiStepForm,
    Home,
    SinglePageForm,
        TemplatePreviewDialog,
        ConnectToPostgresql,
        ConnectMysql,
        ConfirmationDialogBox,
        ConnectorTypeMetadataschemaView,
        ConnectForm
        
        

  ],


  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    HttpClientModule,
    MatDialogModule,
    TitleCasePipe,
    MatDialogModule,
    MatIconModule,
    MatSidenavModule,
    BrowserAnimationsModule
    ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
  ],
  bootstrap: [App]
})
export class AppModule { }
