import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BoardComponent } from './board.component';


import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { FilterSearchBarComponent } from '../filter-search-bar/filter-search-bar.component';
import { TaskboardService } from '../taskboard.service';

import {FontAwesomeTestingModule} from '@fortawesome/angular-fontawesome/testing';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { OutSideEventHandlerDirective } from '../directives/outside-event-handler.directive';

describe('MyLibComponent', () => {
	let component: BoardComponent;
	let fixture: ComponentFixture<BoardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BoardComponent, FilterSearchBarComponent, OutSideEventHandlerDirective],
			imports: [FontAwesomeTestingModule, FormsModule, TypeaheadModule],
			providers: [TaskboardService]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BoardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	// it('should add fa icon packs', inject([FaIconLibrary], (library : FaIconLibrary) => {
	// 	// expect(FaIconLibrary).toBeDefined();
	// 	expect(library.addIconPacks(fas)).toHaveBeenCalled();
	// 	expect(library.addIconPacks(fab)).toHaveBeenCalled();
	// 	expect(library.addIconPacks(far)).toHaveBeenCalled();
	// }));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
