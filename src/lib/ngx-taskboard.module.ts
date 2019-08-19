import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BoardComponent } from './board/board.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Fontawesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { FilterSearchBarComponent } from './filter-search-bar/filter-search-bar.component';
import { TaskboardService } from './taskboard.service';

import { TypeaheadModule  } from 'ngx-bootstrap/typeahead';

library.add(fas, far, fab);

@NgModule({
  declarations: [BoardComponent, FilterSearchBarComponent],
  imports: [BrowserModule, FontAwesomeModule, FormsModule, TypeaheadModule.forRoot(), BrowserAnimationsModule],
  providers: [TaskboardService],
  exports: [BoardComponent]
})
export class NgxTaskboardModule { }
