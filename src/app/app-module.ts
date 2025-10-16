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
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TemplatePreviewDialog } from './dialogs/template-preview-dialog/template-preview-dialog';



@NgModule({
  declarations: [
    App,
    MultiStepForm,
    Home,
    SinglePageForm,
    TemplatePreviewDialog,
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
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [App]
})
export class AppModule { }
