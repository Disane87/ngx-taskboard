import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BoardComponent } from './board/board.component';

// Fontawesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas, far, fab);

@NgModule({
  declarations: [BoardComponent],
  imports: [BrowserModule, FontAwesomeModule],
  exports: [BoardComponent]
})
export class NgxTaskboardModule { }
