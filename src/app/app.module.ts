import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {DownloadsService} from "./services/downloads.service";
import { DownloadsComponent } from './components/downloads/downloads.component';

@NgModule({
  declarations: [
    AppComponent,
    DownloadsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [DownloadsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
