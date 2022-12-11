import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateExplanationComponent } from './pages/create-explanation/create-explanation.component';
import { ViewExplanationComponent } from './pages/view-explanation/view-explanation.component';
import { DecisionComponent } from './pages/decision/decision.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateExplanationComponent,
    ViewExplanationComponent,
    DecisionComponent,
    UploadFileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
