import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BoardComponent } from './board/board.component';

// Fontawesome
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { FilterSearchBarComponent } from './filter-search-bar/filter-search-bar.component';
import { TaskboardService } from './taskboard.service';

import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { OutSideEventHandlerDirective } from './directives/outside-event-handler.directive';

// library.add(fas, far, fab);

@NgModule({
	declarations: [BoardComponent, FilterSearchBarComponent, OutSideEventHandlerDirective],
	imports: [BrowserModule, FontAwesomeModule, FormsModule, TypeaheadModule.forRoot(), BrowserAnimationsModule],
	providers: [TaskboardService],
	exports: [BoardComponent]
})
export class NgxTaskboardModule {
	constructor(library: FaIconLibrary) {
		library.addIconPacks(fas);
		library.addIconPacks(fab);
		library.addIconPacks(far);
	}
}
