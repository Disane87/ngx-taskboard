import {
	AfterViewInit,
	ChangeDetectionStrategy, ChangeDetectorRef, Component,
	DoCheck, ElementRef, EventEmitter,
	HostListener, Input, OnInit,
	Output, Renderer2, TemplateRef
} from '@angular/core';
import { TaskboardService } from '../taskboard.service';
import { CardItem, ClickEvent, CollapseEvent, CollapseState, DropEvent, GroupHeading, GroupKeys, Scrollable, ScrollEvent } from '../types';

@Component({
	// tslint:disable-next-line: component-selector
	selector: 'ngx-taskboard',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit, DoCheck, AfterViewInit {
	@Input() set items(items: (object | CardItem)[]) {
		this._items = items;
		if (items.length > 0) {
			this.prepareBoard();
		}
	}
	get items(): (object | CardItem)[] {
		return this._items;
	}

	/** Shows the blacklog on onit */
	@Input() public showBacklog = true;

	/** Name of the backlog row */
	@Input() public backlogName = 'Backlog';

	/**
	 * Grouping keys for columns (if not passed, the keys will be determined out of the items)
	 * Caution: If you don't pass any headings manually, only the columns are shown, which have data.
	 * If you want to show emtpy rows, please set them
	 */
	@Input() public hGroupKeys: (string | GroupHeading)[] = [];

	/**
	 * Grouping keys for rows (if not passed, the keys will be determined out of the items)
	 * Caution: If you don't pass any headings manually, only the rows are shown, which have data.
	 * If you want to show emtpy rows, please set them
	 */
	@Input() public vGroupKeys: (string | GroupHeading)[] = [];

	/** Show add buttons on the column headings */
	@Input() public hAddNewItems = true;

	/** Show add buttons on the row headings */
	@Input() public vAddNewItems = true;

	/** Show add buttons in the cells for columns and rows */
	@Input() public cellAddNewItems = true;

	/** Key to group data for rows */
	@Input() public vGroupKey = '';

	/** Key to group data for columns */
	@Input() public hGroupKey = '';

	/** Sort items by property */
	@Input() public sortBy = '';

	/** Board name to show between row and column header */
	@Input() public boardName = '';

	/** Invert rows and columns */
	@Input() public invertGroupDirection = false;

	/** All items which can't be grouped into rows and columns are stored into the backlog  */
	@Input() public showUngroupedInBacklog = true;

	/** Decrease overall font size */
	@Input() public smallText = false;

	/** Template for items to render. "item" object ist passed (see examples) */
	@Input() public itemTemplate: TemplateRef<any> = null;

	/** Template for collapsed rows to render. "count" object ist passed (see examples) */
	@Input() public noElementsTemplate: TemplateRef<any> = null;

	/** Template for column headers. Current groupName will be passed (see examples) */
	@Input() public hHeaderTemplate: TemplateRef<any> = null;

	/** Template for row headers. Current groupName will be passed (see examples) */
	@Input() public vHeaderTemplate: TemplateRef<any> = null;

	/** Template for actions, add and collapse buttons (see examples) */
	@Input() public actionsTemplate: TemplateRef<any> = null;

	/** Template for the placeholder element which will be generated when an item is draged over a cell */
	@Input() public dragoverPlaceholderTemplate: TemplateRef<any> = null;

	/** Default css class for row header */
	@Input() public vHeaderClass = 'card-header';

	/** Default css class for column header */
	@Input() public hHeaderClass = 'card-header card-header-bg';

	/** If set to true, the horizontal group keys are fixed positioned to the top and remain at the top while scrolling. Only applied when scrollable is true */
	@Input() public stickyHorizontalHeaderKeys = true;

	/** If set to true, the vertical group keys are fixed positioned to the top and remain at the top while scrolling. Only applied when scrollable is true */
	@Input() public stickyVerticalHeaderKeys = false;

	/** Default css class for cell header */
	@Input() public cellClass = 'card-header';

	/** Column width (in px) which is applied to the columns when the content is scollable */
	@Input() public columnWidth = 200;

	/** Width of the backlog row, when activated. You can use all valid css units. Default is columnWidth  */
	@Input() public backlogWidth = `${this.columnWidth}px`;

	/** Allow to collapse the rows */
	@Input() public vCollapsable = true;

	/** Rows are collapsed or not on init */
	@Input() public vCollapsed = false;

	/** Columns are collapsed or not on init */
	@Input() public hCollapsed = false;

	/** Shows the filter row to search items by filter in filterOnProperties array */
	@Input() public showFilterRow = true;

	/** Placeholder for the input with the filter row */
	@Input() public filterRowPlaceholder = 'Search for items';

	/** Predefined filter for the searchbar. If set, the items are filtered by the term on init. */
	@Input() public filter = '';

	/**
	 * Specify the properties which will be searched for the given term
	 * in filter. If not properties are given, all will be searched
	 */
	@Input() public filterOnProperties: string[] = [];

	/**
	 * The collapse state which is applied when set initially
	 */
	@Input() public initialCollapseState: CollapseState[] = [];

	/** Fired when the user drags an item. Current item is passed */
	@Output() public readonly dragStarted = new EventEmitter<object>();

	/** Fired when an item is dropped. Current item is passed  */
	@Output() public readonly dropped = new EventEmitter<DropEvent>();

	/** Fired when an add action is click. Current ClickEvent is passed */
	@Output() public readonly elementCreateClick = new EventEmitter<ClickEvent>();

	/** Fired when a heading is collapsed. CollapseEvent is emitted */
	@Output() public readonly headingCollapsed = new EventEmitter<CollapseEvent>();

	@Output() public readonly isScrolling = new EventEmitter<ScrollEvent>();
	@Output() public readonly scrolledToEnd = new EventEmitter<ScrollEvent>();

	@Output() public readonly scrollEnded = new EventEmitter<ScrollEvent>();

	/**
	 * Column headings
	 */
	public hHeadings: (string | GroupHeading)[] = [];

	/**
	 * Row headings
	 */
	public vHeadings: (string | GroupHeading)[] = [];

	/**
	 * If set to true, the rows and columns are scrollable and will be out of the viewport.
	 * If not set, all rows and column will only use 100% of the parent element (aligned by flex/flex-fill)
	 */
	public scrollable = false;

	/** If set to true, rows are scrollable */
	public verticalScrolling = false;

	/** If set to true, columns are scrollable */
	public horizontalScrolling = false;

	/** Items to display */
	// tslint:disable-next-line: variable-name
	private _items: (object | CardItem)[] = [];

	private readonly collapseStates: CollapseState[] = [];

	private dragItem: CardItem;
	private nativeDragItem: HTMLElement;
	private placeholderSet = false;
	private currentDragZone: string;

	private isScrollingTimeout = 0;

	constructor(
		private readonly renderer: Renderer2,
		private readonly elRef: ElementRef,
		private readonly cd: ChangeDetectorRef,
		private readonly taskboardService: TaskboardService
	) { }

	@HostListener('window:resize', ['$event']) public onResize() {
		this.checkIfContentNeedsToScroll();
	}

	public ngOnInit(): void {
		if (this.items.length > 0) {
			this.prepareBoard();
		}
	}

	public ngDoCheck(): void {
		this.checkIfContentNeedsToScroll();
	}


	public ngAfterViewInit(): void {
		// Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
		// Add 'implements AfterViewInit' to the class.
	}

	/**
	 * Checks if content needs to scroll
	 */
	private checkIfContentNeedsToScroll(): void {
		const { hScroll: h, vScroll: v } = this.containerIsScrollable('.column-cards');
		this.horizontalScrolling = h;
		this.verticalScrolling = v;

		this.cd.markForCheck();
	}


	/**
	 * Prepares board
	 */
	private prepareBoard(): void {

		this.checkPrerequisites().then(() => {
			this.generateHeadings();

			this.collapseStates.push(...this.generateCollapseStates(this.hHeadings, 'h'), ...this.generateCollapseStates(this.vHeadings, 'v'));
			this.matchAndSetInitialCollapseState();

			this.taskboardService.filterChanged$.subscribe(filter => this.filter = filter);

			// this.cd.markForCheck();
			this.checkIfContentNeedsToScroll();
		});
	}

	/**
	 * Matches and set initial collapse state
	 */
	private matchAndSetInitialCollapseState() {
		this.initialCollapseState.forEach(item => {
			const foundCollapseState = this.collapseStates.find(cS => cS.name.toLowerCase() === item.name.toLowerCase());
			if (foundCollapseState && foundCollapseState.collapsed !== item.collapsed) {
				foundCollapseState.collapsed = item.collapsed;
			}
		});
	}

	/**
	 * Checks prerequisites
	 * @returns prerequisites
	 */
	private checkPrerequisites(): Promise<boolean> {
		if (this.checkIfPropIsObject(this.hGroupKeys[0])) {
			const hasValueProperty = this.hGroupKeys.every((item: GroupHeading) => item.value != null);
			if (!hasValueProperty) {
				throw new Error((`Column headers are objects but field 'value' is missing in one or more items.`));
			}

		}

		if (this.checkIfPropIsObject(this.vGroupKeys[0])) {
			const hasValueProperty = this.vGroupKeys.every((item: GroupHeading) => item.value != null);
			if (!hasValueProperty) {
				throw new Error((`Row headers are objects but field 'value' is missing in one or more items.`));
			}

		}

		return Promise.resolve(true);
	}

	/**
	 * Checks if prop is object
	 * @returns true if if prop is object
	 */
	private checkIfPropIsObject(prop: any): boolean {
		return typeof (prop) === 'object';
	}

	/**
	 * Generates the appropiate headings
	 * @memberOf BoardComponent
	 */
	private generateHeadings(): void {
		if (this.invertGroupDirection) {
			const vGkey = this.vGroupKey;
			const hGkey = this.hGroupKey;

			this.hGroupKey = vGkey;
			this.vGroupKey = hGkey;
		}

		this.vHeadings = this.getHeadings(this.vGroupKeys, this.vGroupKey);
		this.hHeadings = this.getHeadings(this.hGroupKeys, this.hGroupKey);
	}

	/**
	 * Generates collapse states
	 * @param array Array of collapse states
	 * @param diretion Generate collapse states for vertical or horizontal groups
	 * @returns collapse states
	 */
	private generateCollapseStates(array: (string | GroupHeading)[], direction: 'h' | 'v'): CollapseState[] {
		return array.map(item => ({ name: this.getValue(item), collapsed: (direction === 'h') ? this.hCollapsed : this.vCollapsed }));
	}

	/**
	 * Gets all items of a cell (row / col)
	 *
	 * @param vValue Value of the row
	 * @param hValue Value of the column
	 * @returns Array of all items of a cell
	 *
	 * @memberOf BoardComponent
	 */
	public getItemsOfGroup(vValue: string, hValue: string): (CardItem | object)[] {
		// console.log('getItemsOfGroup');

		let items = this.items.filter(item => {

			if (this.taskboardService.objectProperties.length === 0) {
				this.taskboardService.objectProperties = Object.keys(item);
			}
			const groupKeys: GroupKeys = this.determineCorrectGroupKeys();

			const vItem = this.getValue(item[groupKeys.vGroupKey]);
			const hItem = this.getValue(item[groupKeys.hGroupKey]);

			if (hItem === undefined || hItem === undefined && vItem === undefined || vItem === undefined) {
				return false;
			}

			const found = vItem.toLowerCase() === vValue.toLowerCase() && hItem.toLowerCase() === hValue.toLowerCase();

			return found;
		});

		if (this.showUngroupedInBacklog) {
			items = items.filter(item => item[this.vGroupKey] !== '' && item[this.hGroupKey] !== '');
		}

		if (this.sortBy !== '') {
			const fieldType = typeof (items.some(() => items[0][this.sortBy] !== undefined && items[0][this.sortBy] !== null)[this.sortBy]);
			if (fieldType) {
				items = items.sort((a, b) => {

					const aField = a[this.sortBy];
					const bField = b[this.sortBy];

					if (fieldType === 'number') {
						return bField - aField;
					}

					if (fieldType === 'string') {
						if (aField < bField) {
							return -1;
						}
						if (aField > bField) {
							return 1;
						}

						return 0;
					}

				});
			}
		}

		return (this.filter !== '') ? items.filter((item) =>
			(this.filterOnProperties.length > 0 ? this.filterOnProperties : Object.keys(item)).some(key => {
				const found = item[key] !== null && typeof (item[key]) !== 'number' && ((item[key] as string).indexOf(this.filter) > -1 ? true : false);
				// found && console.info(`Searching "${item[key]}" for "${this.filter}" | Found ${found}`);
				return found;
			})) : items;
	}

	/**
	 * Toggles in entire group (all rows or all columns)
	 *
	 * @param direction Direction to toggle
	 * @param collapsed Current collapse state
	 *
	 * @memberOf BoardComponent
	 */
	public toggleCollapseGroup(direction: string, collapsed: boolean): void {
		const groupKeysToToggle =
			this.collapseStates.filter(item => (direction === 'vertical' ? this.vHeadings : this.hHeadings)
				.some(i =>
					this.getValue(i)
						.toLowerCase() === item.name.toLowerCase()));

		groupKeysToToggle.forEach(item => item.collapsed = !collapsed);
		if (groupKeysToToggle.length > 0) {
			if (direction === 'vertical') {
				this.vCollapsed = !collapsed;
			} else {
				this.hCollapsed = !collapsed;
			}
		}

		this.headingCollapsed.emit({
			group: direction,
			collapsed: !collapsed,
			overallCollapseState: this.collapseStates
		});

		setTimeout(() => this.cd.markForCheck(), 100);

	}

	/**
	 * Gets the value of an item
	 *
	 * @param item Item to get the value from
	 * @returns Value of item
	 *
	 * @memberOf BoardComponent
	 */
	public getValue(item: string | GroupHeading): string {
		if (item as GroupHeading) {
			return ((item as GroupHeading).value ? (item as GroupHeading).value : item as string);
		}
		return '';
	}

	/**
	 * Determines correct group keys
	 * @param item Item object to check
	 * @returns correct group keys
	 */
	private determineCorrectGroupKeys(): GroupKeys {
		return {
			hGroupKey: this.getCaseInsensitivePropKey(this.items[0], this.hGroupKey),
			vGroupKey: this.getCaseInsensitivePropKey(this.items[0], this.vGroupKey)
		};
	}

	/**
	 * Gets case insensitive prop key
	 * @param item Item object
	 * @param propKey property key
	 * @returns case insensitive prop key
	 */
	private getCaseInsensitivePropKey(item: object, propKey: string): string {
		if (item) {
			return Object.keys(item)
				.find(key => (key !== '' && key !== undefined && key !== undefined)
					? key.toLowerCase() === propKey.toLowerCase()
					: false
				);
		}

		return '';
	}

	/**
	 * Gets headings from items
	 * @param [groupKey] key to get the group keys
	 * @returns headings from items
	 */
	private getHeadingsFromItems(groupKey: string = this.vGroupKey): string[] {
		const keys = (this.items as object[]).map((item: any) =>
			item[Object.keys(item)
				.find(key => key.toLowerCase() === groupKey.toLowerCase())]
		);

		return keys.filter((elem, pos, arr) =>
			arr.indexOf(elem) === pos && (this.showUngroupedInBacklog && (elem !== '' && elem !== undefined)));
	}

	/**
	 * Gets ungrouped items (which could not be put into rows or cols)
	 *
	 * @returns Array of ungrouped items
	 *
	 * @memberOf BoardComponent
	 */
	public getUngroupedItems(): (CardItem | object)[] {
		if (this.showUngroupedInBacklog) {
			return this.items.filter(item => {
				const groupKeys: GroupKeys = this.determineCorrectGroupKeys();
				const isUngrouped =
					(item[groupKeys.vGroupKey] === '' && item[groupKeys.hGroupKey] === '')
					||
					(item[groupKeys.vGroupKey] === null && item[groupKeys.hGroupKey] === null);

				return isUngrouped;
			});
		}

		return [];
	}

	/**
	 * Toggles an elements collapse state
	 *
	 * @param group Column and row value
	 *
	 * @memberOf BoardComponent
	 */
	public toggleCollapse(group: { hGroup: string | GroupHeading, vGroup: string | GroupHeading }): void {

		const part = this.getValue(group.hGroup || group.vGroup);
		// console.log("Toggle: " + part);

		const collapseState = this.collapseState(part);
		this.collapseStates.find(item => item.name === part).collapsed = !collapseState;

		this.headingCollapsed.emit({
			group: group.hGroup || group.vGroup,
			collapsed: !collapseState,
			overallCollapseState: this.collapseStates
		});
	}

	/**
	 * Gets the current collapse state of a specific item
	 *
	 * @param collapseItem Item to get the collapse state
	 * @returns true if collapsed, false when expanded
	 *
	 * @memberOf BoardComponent
	 */
	public collapseState(collapseItem: string | GroupHeading): boolean {

		if (typeof (collapseItem) === 'object') {
			collapseItem = (collapseItem).value;
		}

		const foundItem = this.collapseStates.find(item => item.name === this.getValue(collapseItem));
		if (foundItem) {
			const foundCollapsedState = foundItem.collapsed;
			// console.log('collapseState', part, foundCollapsedState);

			return foundCollapsedState;
		}
		return false;
	}

	/**
	 * Handler which is called when an item starts to drag
	 *
	 * @param event Native drag event
	 * @param item CardItem which is dragged
	 *
	 * @memberOf BoardComponent
	 */
	public dragStart(event: DragEvent, item: CardItem): void {
		this.dragItem = item;
		this.nativeDragItem = (event.currentTarget as HTMLElement);
		this.dragStarted.emit(this.dragItem);
	}

	/**
	 * Handler which is called, when the drag of an item ends
	 *
	 * @param event Native drag event
	 * @param item CardItem which is dragged
	 *
	 * @memberOf BoardComponent
	 */
	public dragEnd(): void {
		this.dragItem = undefined;
	}


	/**
	 * Handler which is called, when a new item should be created (click on a add icon)
	 *
	 * @param group Row and column value
	 *
	 * @memberOf BoardComponent
	 */
	public createElement(group: ClickEvent): void {
		this.elementCreateClick.emit(group);
	}

	/**
	 * Handler which is called when an item is dropped
	 *
	 * @param event Native drag event
	 * @param vRow Row item
	 * @param hRow Column item
	 *
	 * @memberOf BoardComponent
	 */
	public drop(event: DragEvent, vRow: string | GroupHeading, hRow: string | GroupHeading): void {
		event.preventDefault();
		if (event.currentTarget) {
			const placeholderEl = (event.currentTarget as HTMLElement).querySelector('.placeholder');
			if (placeholderEl) {
				this.renderer.removeChild(placeholderEl.parentNode, placeholderEl);
			}
			this.currentDragZone = '';
			this.placeholderSet = false;
		}

		const groupKeys: GroupKeys = this.determineCorrectGroupKeys();
		const dragItemBeforeChange = { ...this.dragItem };

		this.dragItem[groupKeys.vGroupKey] = this.getValue(vRow);
		this.dragItem[groupKeys.hGroupKey] = this.getValue(hRow);

		this.dropped.emit({
			hGroup: hRow,
			vGroup: vRow,
			item: this.dragItem,
			itemBeforeChange: dragItemBeforeChange,
			nativeItemElement: this.nativeDragItem
		});
		this.dragItem = undefined;
	}

	/**
	 * Handler which is called when an item is dragged over a cell
	 *
	 * @param event Native html drag event
	 * @param vRow Row item
	 * @param hRow Column item
	 *
	 * @memberOf BoardComponent
	 */
	public dragOver(event: DragEvent, vRow: string | GroupHeading, hRow: string | GroupHeading): void {
		if (this.dragItem) {
			event.preventDefault();

			if (vRow === undefined) {
				vRow = '';
			}

			if (hRow === undefined) {
				hRow = '';
			}

			vRow = this.getValue(vRow);
			hRow = this.getValue(hRow);

			const dragZone = `${vRow}-${hRow.replace(' ', '')}`.toLowerCase();
			if (dragZone !== this.currentDragZone && this.currentDragZone !== '') {
				const lastPlaceholder = document.getElementById(this.currentDragZone);
				if (lastPlaceholder) {
					this.renderer.removeChild(lastPlaceholder.parentNode, lastPlaceholder);
					this.placeholderSet = false;
				}
			}

			this.currentDragZone = `${vRow}-${hRow.replace(' ', '')}`.toLowerCase();

			if (!this.placeholderSet) {
				const placeholderElement = this.createPlaceholderElement();
				this.renderer.appendChild(event.currentTarget, placeholderElement);
				this.placeholderSet = true;
			}
		}
	}

	/**
	 * Checks if container is scrollable
	 * @param containerName Container to check if scrollable
	 * @returns is scrollable
	 */
	private containerIsScrollable(containerName: string): Scrollable {
		const container = this.elRef.nativeElement.querySelector(containerName);
		if (container) {
			const hasHorizontalScrollbar = container.scrollWidth > container.clientWidth;
			const hasVerticalScrollbar = container.scrollHeight > container.clientHeight;

			return {
				hScroll: hasHorizontalScrollbar,
				vScroll: hasVerticalScrollbar
			};
		}

		return null;
	}

	/**
	 * Determines the style of a container which includes the scrollbar
	 *
	 * @returns Style of the container the scrollbar is applied to
	 *
	 * @memberOf BoardComponent
	 */
	public scrollBarStyle(): object {

		return {
			'padding-right': `${this.calculateScrollBarWidth()}px`
		};
	}

	/**
	 * Gets the current width of a scrollbar
	 *
	 * @returns Object with native css style
	 *
	 * @memberOf BoardComponent
	 */
	public getColumnWidth(): object {
		if (!this.scrollable) { return {}; }

		return {
			'min-width': `${this.columnWidth}px`
		};
	}

	private calculateScrollBarWidth(): number {
		const headingsRowWidth = this.elRef.nativeElement.querySelector('.headings').clientWidth;
		const contentWidth = this.elRef.nativeElement.querySelector('.row-content').clientWidth;

		return headingsRowWidth - contentWidth;
	}

	/**
	 * Creates placeholder element
	 * @returns placeholder element
	 */
	private createPlaceholderElement(): HTMLElement {
		if (this.dragoverPlaceholderTemplate) {
			return this.dragoverPlaceholderTemplate.elementRef.nativeElement.cloneNode(true);
		}

		const placeholderElement: HTMLElement = this.renderer.createElement('div');
		this.renderer.setStyle(placeholderElement, 'border', '1px dashed gray');
		this.renderer.setStyle(placeholderElement, 'width', '100%');
		this.renderer.setStyle(placeholderElement, 'height', '50px');
		this.renderer.setAttribute(placeholderElement, 'id', this.currentDragZone);
		this.renderer.setAttribute(placeholderElement, 'class', 'placeholder');

		return placeholderElement;
	}

	/**
	 * Gets headings
	 * @param keys key array
	 * @param key key to check
	 * @returns headings
	 */
	private getHeadings(keys: any[], key: string): (string | GroupHeading)[] {
		if ((keys.length > 0 && (keys[0] as GroupHeading).value !== '')) {
			return keys.sort((a: GroupHeading, b: GroupHeading) => a.orderId - b.orderId);
		}

		return this.getHeadingsFromItems(key);

	}

	/**
	 * Scrolling board component
	 * @param event Event
	 */
	public scrolling(event: Event) {
		const target = (event.currentTarget as HTMLElement);

		// Clear our timeout throughout the scroll
		this.detectIfUserHasEndedScrolling().then(() => {
			const scrollStateEnded = this.getScrollState(target);
			scrollStateEnded.hasReachedEnd = false;
			scrollStateEnded.isScrolling = false;
			if (Math.round(scrollStateEnded.distance) !== Math.round(scrollStateEnded.maxDistance)) {
				scrollStateEnded.hasReachedEnd = false;
				this.scrollEnded.emit(scrollStateEnded);
			} else {
				scrollStateEnded.hasReachedEnd = true;
				this.scrolledToEnd.emit(scrollStateEnded);
				this.scrollEnded.emit(scrollStateEnded);
			}
		});

		const scrollState = this.getScrollState(target);
		scrollState.hasReachedEnd = false;
		scrollState.isScrolling = true;
		this.isScrolling.emit(scrollState);
	}

	private getScrollState(target: HTMLElement): ScrollEvent {
		const scrollTop = target.scrollTop;
		const scrollAxis: 'x' | 'y' = (scrollTop > 0) ? 'y' : 'x';

		const currentDistance = (scrollAxis === 'y' ? target.scrollTop : target.scrollWidth);
		const maximumDistance = (scrollAxis === 'y' ? target.scrollHeight - target.clientHeight : target.scrollWidth - target.clientWidth);

		return {
			axis: scrollAxis,
			distance: currentDistance,
			maxDistance: maximumDistance
		};
	}


	/**
	 * Detects if user has ended scrolling
	 * Got from: https://gomakethings.com/detecting-when-a-visitor-has-stopped-scrolling-with-vanilla-javascript/
	 * @returns if user has ended scrolling
	 */
	private detectIfUserHasEndedScrolling(): Promise<boolean> {
		return new Promise((res) => {
			window.clearTimeout(this.isScrollingTimeout);
			// Set a timeout to run after scrolling ends
			this.isScrollingTimeout = window.setTimeout(() => {
				// Run the callback
				return res(true);
			}, 66);
		});

	}
}
