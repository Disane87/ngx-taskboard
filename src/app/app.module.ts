import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxTaskboardModule } from '@disane/ngx-taskboard';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, NgxTaskboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
