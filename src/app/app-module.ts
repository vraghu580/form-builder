import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MultiStepForm } from './multi-step-form/multi-step-form';
import { CommonModule } from '@angular/common';
import { Home } from './home/home';
import { SinglePageForm } from './single-page-form/single-page-form';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { ConfirmationDialogBox } from './components/confirmation-dialog-box/confirmation-dialog-box';
import { MatDialogModule } from '@angular/material/dialog';
import { ConnectorTypeMetadataschemaView } from './components/dialog/connector-type-metadataschema-view/connector-type-metadataschema-view';




@NgModule({
  declarations: [
    App,
    MultiStepForm,
    Home,
    SinglePageForm,
    ConfirmationDialogBox,
    ConnectorTypeMetadataschemaView,
    
  ],


  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,

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
