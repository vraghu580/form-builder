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
<<<<<<< HEAD
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TemplatePreviewDialog } from './dialogs/template-preview-dialog/template-preview-dialog';
=======
import { ConnectorForm } from './connector-form/connector-form';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';

>>>>>>> 50591f35d6aaf172e929b51b526c3202be758993



@NgModule({
  declarations: [
    App,
    MultiStepForm,
    Home,
    SinglePageForm,
<<<<<<< HEAD
    TemplatePreviewDialog,
=======
    ConnectorForm,
>>>>>>> 50591f35d6aaf172e929b51b526c3202be758993
  ],


  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    BrowserModule

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
