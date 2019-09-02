import {
	ChangeDetectionStrategy,
	ChangeDetectorRef, Component, ElementRef,
	EventEmitter, HostListener, Input,
	OnInit, Output, Renderer2,
	TemplateRef, DoCheck, AfterViewInit
} from '@angular/core';
import { TaskboardService } from '../taskboard.service';
import { CardItem, ClickEvent, CollapseState, GroupHeading, GroupKeys, Scrollable, DropEvent } from '../types';

@Component({
	// tslint:disable-next-line: component-selector
	selector: 'ngx-taskboard',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit, DoCheck, AfterViewInit {
	@Input() set items(items: Array<object | CardItem>) {
		this._items = items;
		if (items.length > 0) {
			this.prepareBoard();
		}
	}
	get items(): Array<object | CardItem> {
		return this._items;
	}

	/** Shows the blacklog on onit */
	@Input() showBacklog = true;

	/** Name of the backlog row */
	@Input() backlogName = 'Backlog';

	/**
	 * Grouping keys for columns (if not passed, the keys will be determined out of the items)
	 * Caution: If you don't pass any headings manually, only the columns are shown, which have data.
	 * If you want to show emtpy rows, please set them
	 */
	@Input() hGroupKeys: Array<string | GroupHeading> = [];

	/**
	 * Grouping keys for rows (if not passed, the keys will be determined out of the items)
	 * Caution: If you don't pass any headings manually, only the rows are shown, which have data.
	 * If you want to show emtpy rows, please set them
	 */
	@Input() vGroupKeys: Array<string | GroupHeading> = [];

	/** Show add buttons on the column headings */
	@Input() hAddNewItems = true;

	/** Show add buttons on the row headings */
	@Input() vAddNewItems = true;

	/** Show add buttons in the cells for columns and rows */
	@Input() cellAddNewItems = true;

	/** Key to group data for rows */
	@Input() vGroupKey = '';

	/** Key to group data for columns */
	@Input() hGroupKey = '';

	/** Sort items by property */
	@Input() sortBy = '';

	/** Board name to show between row and column header */
	@Input() boardName = '';

	/** Invert rows and columns */
	@Input() invertGroupDirection = false;

	/** All items which can't be grouped into rows and columns are stored into the backlog  */
	@Input() showUngroupedInBacklog = true;

	/** Decrease overall font size */
	@Input() smallText = false;

	/** Template for items to render. "item" object ist passed (see examples) */
	@Input() itemTemplate: TemplateRef<any> = null;

	/** Template for collapsed rows to render. "count" object ist passed (see examples) */
	@Input() noElementsTemplate: TemplateRef<any> = null;

	/** Template for column headers. Current groupName will be passed (see examples) */
	@Input() hHeaderTemplate: TemplateRef<any> = null;

	/** Template for row headers. Current groupName will be passed (see examples) */
	@Input() vHeaderTemplate: TemplateRef<any> = null;

	/** Template for actions, add and collapse buttons (see examples) */
	@Input() actionsTemplate: TemplateRef<any> = null;

	/** Template for the placeholder element which will be generated when an item is draged over a cell */
	@Input() dragoverPlaceholderTemplate: TemplateRef<any> = null;

	/** Default css class for row header */
	@Input() vHeaderClass = 'card-header';

	/** Default css class for column header */
	@Input() hHeaderClass = 'card-header card-header-bg';

	/** If set to true, the horizontal group keys are fixed positioned to the top and remain at the top while scrolling. Only applied when scrollable is true */
	@Input() stickyHorizontalHeaderKeys = true;

	/** If set to true, the vertical group keys are fixed positioned to the top and remain at the top while scrolling. Only applied when scrollable is true */
	@Input() stickyVerticalHeaderKeys = false;

	/** Default css class for cell header */
	@Input() cellClass = 'card-header';

	/** Column width (in px) which is applied to the columns when the content is scollable */
	@Input() columnWidth = 200;

	/** Width of the backlog row, when activated. You can use all valid css units. Default is columnWidth  */
	@Input() backlogWidth = `${this.columnWidth}px`;

	/** Allow to collapse the rows */
	@Input() vCollapsable = true;

	/** Rows are collapsed or not on init */
	@Input() vCollapsed = false;

	/** Columns are collapsed or not on init */
	@Input() hCollapsed = false;

	/** Shows the filter row to search items by filter in filterOnProperties array */
	@Input() showFilterRow = true;

	/** Placeholder for the input with the filter row */
	@Input() filterRowPlaceholder = 'Search for items';

	/** Predefined filter for the searchbar. If set, the items are filtered by the term on init. */
	@Input() filter = '';

	/**
	 * Specify the properties which will be searched for the given term
	 * in filter. If not properties are given, all will be searched
	 */
	@Input() filterOnProperties: Array<string> = [];

	/** Fired when the user drags an item. Current item is passed */
	@Output() readonly dragStarted = new EventEmitter<object>();

	/** Fired when an item is dropped. Current item is passed  */
	@Output() readonly dropped = new EventEmitter<DropEvent>();

	/** Fired when an add action is click. Current ClickEvent is passed */
	@Output() readonly elementCreateClick = new EventEmitter<ClickEvent>();
	hHeadings: Array<string | GroupHeading> = [];
	vHeadings: Array<string | GroupHeading> = [];

	/**
	 * If set to true, the rows and columns are scrollable and will be out of the viewport.
	 * If not set, all rows and column will only use 100% of the parent element (aligned by flex/flex-fill)
	 */
	scrollable = false;

	/** If set to true, rows are scrollable */
	verticalScrolling = false;

	/** If set to true, columns are scrollable */
	horizontalScrolling = false;

	/** Items to display */
	// tslint:disable-next-line: variable-name
	private _items: Array<object | CardItem> = [];

	private readonly collapseStates: Array<CollapseState> = [];

	private dragItem: CardItem;
	private placeholderSet = false;
	private currentDragZone: string;

	constructor(
		private readonly renderer: Renderer2,
		private readonly elRef: ElementRef,
		private readonly cd: ChangeDetectorRef,
		private readonly taskboardService: TaskboardService
	) { }

	@HostListener('window:resize', ['$event']) onResize(event) {
		this.checkIfContentNeedsToScroll();
	}

	ngOnInit(): void {
		if (this.items.length > 0) {
			this.prepareBoard();
		}
	}

	ngDoCheck(): void {
		this.checkIfContentNeedsToScroll();
	}

	private checkIfContentNeedsToScroll(): void {
		const { hScroll: h, vScroll: v } = this.containerIsScrollable('.column-cards');
		this.horizontalScrolling = h;
		this.verticalScrolling = v;
	}

	ngAfterViewInit(): void {
		// Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
		// Add 'implements AfterViewInit' to the class.
	}

	private prepareBoard(): void {
		this.generateHeadings();

		this.collapseStates.push(...this.generateCollapseStates(this.hHeadings, 'h'), ...this.generateCollapseStates(this.vHeadings, 'v'));
		this.taskboardService.filterChanged$.subscribe(filter => this.filter = filter);

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

	private generateCollapseStates(array: Array<string | GroupHeading>, diretion: 'h' | 'v'): Array<CollapseState> {
		return array.map(item => ({ name: this.getValue(item), collapsed: (diretion === 'h') ? this.hCollapsed : this.vCollapsed }));
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
	public getItemsOfGroup(vValue: string, hValue: string): Array<CardItem | object> {
		// console.log('getItemsOfGroup');

		let items = this.items.filter(item => {

			if (this.taskboardService.objectProperties.length === 0) {
				this.taskboardService.objectProperties = Object.keys(item);
			}
			const groupKeys: GroupKeys = this.determineCorrectGroupKeys(item);

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
			const fieldType = typeof (items.some(item => items[0][this.sortBy] !== undefined && items[0][this.sortBy] !== null)[this.sortBy]);
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

		return (this.filter !== '') ? items.filter((item, index, array) =>
			(this.filterOnProperties.length > 0 ? this.filterOnProperties : Object.keys(item)).some(key => {
				const found = item[key] !== undefined && typeof (item[key]) !== 'number' && ((item[key] as string).indexOf(this.filter) > -1 ? true : false);
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
		return ((item as GroupHeading).value ? (item as GroupHeading).value : item as string);
	}

	private determineCorrectGroupKeys(item: object): GroupKeys {
		return {
			hGroupKey: this.getCaseInsensitivePropKey(this.items[0], this.hGroupKey),
			vGroupKey: this.getCaseInsensitivePropKey(this.items[0], this.vGroupKey)
		};
	}

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

	private getHeadingsFromItems(groupKey: string = this.vGroupKey): Array<string> {
		const keys = (this.items as Array<object>).map((item: any) =>
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
	public getUngroupedItems(): Array<CardItem | object> {
		if (this.showUngroupedInBacklog) {
			return this.items.filter(item => {
				const groupKeys: GroupKeys = this.determineCorrectGroupKeys(item);
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
	public toggleCollapse(group: { hGroup: string, vGroup: string }): void {

		const part = this.getValue(group.hGroup || group.vGroup);
		// console.log("Toggle: " + part);

		const collapseState = this.collapseState(part);
		this.collapseStates.find(item => item.name === part).collapsed = !collapseState;
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

		const foundCollapsedState = this.collapseStates.find(item => item.name === this.getValue(collapseItem)).collapsed;
		// console.log('collapseState', part, foundCollapsedState);

		return foundCollapsedState;
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
	public dragEnd(event: DragEvent, item: CardItem): void {
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

		const groupKeys: GroupKeys = this.determineCorrectGroupKeys(this.dragItem);
		const dragItemBeforeChange = this.dragItem;

		this.dragItem[groupKeys.vGroupKey] = vRow;
		this.dragItem[groupKeys.hGroupKey] = hRow;

		this.dropped.emit({
			hGroup: hRow,
			vGroup: vRow,
			item: this.dragItem,
			itemBeforeChange: dragItemBeforeChange
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
				const placeholderElement = this.createPlaceholderElement(this.currentDragZone);
				this.renderer.appendChild(event.currentTarget, placeholderElement);
				this.placeholderSet = true;
			}
		}
	}

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

	private createPlaceholderElement(id: string): HTMLElement {
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

	private getHeadings(keys: Array<any>, key: string): Array<string | GroupHeading> {
		if ((keys.length > 0 && (keys[0] as GroupHeading).value !== '')) {
			return keys.sort((a: GroupHeading, b: GroupHeading) => a.orderId - b.orderId);
		}

		return this.getHeadingsFromItems(key);

	}
}
