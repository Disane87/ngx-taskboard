import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FilterSearchBarComponent } from '../filter-search-bar/filter-search-bar.component';
import { TaskboardService } from '../taskboard.service';
import { BoardComponent } from './board.component';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas, far, fab);


describe('MyLibComponent', () => {
	let component: BoardComponent;
	let fixture: ComponentFixture<BoardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BoardComponent, FilterSearchBarComponent],
			imports: [FontAwesomeModule, FormsModule],
			providers: [TaskboardService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BoardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
