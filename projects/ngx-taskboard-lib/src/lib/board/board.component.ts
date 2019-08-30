import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, TemplateRef, ChangeDetectionStrategy, SimpleChanges, HostListener } from '@angular/core';
import { CardItem, CollapseState, ClickEvent, GroupKeys, Scrollable, GroupHeading } from '../types';
import { TaskboardService } from '../taskboard.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ngx-taskboard',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit {

  /** Shows the blacklog on onit */
  @Input() showBacklog: boolean = true;

  /** Name of the backlog row */
  @Input() backlogName: string = 'Backlog';

  /** Items to display */
  private _items: Array<object | CardItem> = [];
  @Input() set items(items: Array<object | CardItem>) {
    this._items = items;
    if (items.length > 0) {
      this.prepareBoard();
    }
  }
  get items(): Array<object | CardItem> {
    return this._items;
  }

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
  @Input() hAddNewItems: boolean = true;

  /** Show add buttons on the row headings */
  @Input() vAddNewItems: boolean = true;

  /** Show add buttons in the cells for columns and rows */
  @Input() cellAddNewItems: boolean = true;

  /** Key to group data for rows */
  @Input() vGroupKey: string = '';

  /** Key to group data for columns */
  @Input() hGroupKey: string = '';

  /** Sort items by property */
  @Input() sortBy: string = '';

  /** Board name to show between row and column header */
  @Input() boardName: string = '';

  /** Invert rows and columns */
  @Input() invertGroupDirection: boolean = false;

  /** All items which can't be grouped into rows and columns are stored into the backlog  */
  @Input() showUngroupedInBacklog: boolean = true;

  /** Decrease overall font size */
  @Input() smallText: boolean = false;

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
  @Input() vHeaderClass: string = 'card-header';

  /** Default css class for column header */
  @Input() hHeaderClass: string = 'card-header card-header-bg';

  /** If set to true, the horizontal group keys are fixed positioned to the top and remain at the top while scrolling. Only applied when scrollable is true */
  @Input() stickyHorizontalHeaderKeys: boolean = true;

  /** If set to true, the vertical group keys are fixed positioned to the top and remain at the top while scrolling. Only applied when scrollable is true */
  @Input() stickyVerticalHeaderKeys: boolean = false;

  /** Default css class for cell header */
  @Input() cellClass: string = 'card-header';

  /** Column width (in px) which is applied to the columns when the content is scollable */
  @Input() columnWidth: number = 200;

  /** Width of the backlog row, when activated. You can use all valid css units. Default is columnWidth  */
  @Input() backlogWidth: string = `${this.columnWidth}px`;

  /** Allow to collapse the rows */
  @Input() vCollapsable: boolean = true;

  /** Rows are collapsed or not on init */
  @Input() vCollapsed: boolean = false;

  /** Columns are collapsed or not on init */
  @Input() hCollapsed: boolean = false;

  /** Shows the filter row to search items by filter in filterOnProperties array */
  @Input() showFilterRow: boolean = true;

  /** Placeholder for the input with the filter row */
  @Input() filterRowPlaceholder: string = 'Search for items';

  /** SPlaceholde rfor the input with the filter row*/
  @Input() filterRowPlaceholder: string = 'Search for items';

  /** Predefined filter for the searchbar. If set, the items are filtered by the term on init. */
  @Input() filter: string = '';

  /** Specify the properties which will be searched for the given term in filter. If not properties are given, all will be searched */
  @Input() filterOnProperties: Array<string> = [];

  /** Fired when the user drags an item. Current item is passed */
  @Output() readonly dragStarted = new EventEmitter<object>();

  /** Fired when an item is dropped. Current item is passed  */
  @Output() readonly dropped = new EventEmitter<object>();

  /** Fired when an add action is click. Current ClickEvent is passed */
  @Output() readonly elementCreateClick = new EventEmitter<ClickEvent>();

  private readonly collapseStates: Array<CollapseState> = [];
  public hHeadings: Array<string | GroupHeading> = [];
  public vHeadings: Array<string | GroupHeading> = [];

  private dragItem: CardItem;
  private placeholderSet = false;
  private currentDragZone: string;

  /**
  * If set to true, the rows and columns are scrollable and will be out of the viewport.
  * If not set, all rows and column will only use 100% of the parent element (aligned by flex/flex-fill)
  */
  public scrollable: boolean = false;

  /** If set to true, rows are scrollable */
  public verticalScrolling: boolean = false;

  /** If set to true, columns are scrollable */
  public horizontalScrolling: boolean = false;

  constructor(
    private readonly renderer: Renderer2,
    private readonly elRef: ElementRef,
    private readonly cd: ChangeDetectorRef,
    private taskboardService: TaskboardService
  ) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkIfContentNeedsToScroll();
  }

  ngOnInit() {
    if (this.items.length > 0) {
      this.prepareBoard();
    }
  }

  ngDoCheck() {
    this.checkIfContentNeedsToScroll();
  }

  checkIfContentNeedsToScroll() {
    let { hScroll: h, vScroll: v } = this.containerIsScrollable('.column-cards');
    this.horizontalScrolling = h;
    this.verticalScrolling = v;
  }


  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    // debugger;
    setTimeout(() => {

    }, 1000)

  }

  prepareBoard() {
    this.generateHeadings();

    this.collapseStates.push(...this.generateCollapseStates(this.hHeadings, 'h'), ...this.generateCollapseStates(this.vHeadings, 'v'));
    this.taskboardService.filterChanged$.subscribe(filter => this.filter = filter);

  }

  generateHeadings() {
    if (this.invertGroupDirection) {
      const vGkey = this.vGroupKey;
      const hGkey = this.hGroupKey;

      this.hGroupKey = vGkey;
      this.vGroupKey = hGkey;
    }

    this.vHeadings = this.getHeadings(this.vGroupKeys, this.vGroupKey);
    this.hHeadings = this.getHeadings(this.hGroupKeys, this.hGroupKey);
  }

  private getHeadings(keys: Array<any>, key: string): Array<string | GroupHeading> {
    if ((keys.length > 0 && (keys[0] as GroupHeading).value != '')) {
      return keys.sort((a: GroupHeading, b: GroupHeading) => a.orderId - b.orderId);
    } else {
      return this.getHeadingsFromItems(key);
    }
  }


  generateCollapseStates(array: Array<string | GroupHeading>, diretion: 'h' | 'v'): CollapseState[] {
    return array.map(item => ({ name: this.getValue(item), collapsed: (diretion == 'h') ? this.hCollapsed : this.vCollapsed }));
  }

  getItemsOfGroup(vValue: string, hValue: string): Array<CardItem | object> {
    // console.log('getItemsOfGroup');

    let items = this.items.filter(item => {

      if (this.taskboardService.objectProperties.length === 0) {
        this.taskboardService.objectProperties = Object.keys(item);
      }
      const groupKeys: GroupKeys = this.determineCorrectGroupKeys(item);

      const vItem = this.getValue(item[groupKeys.vGroupKey]);
      const hItem = this.getValue(item[groupKeys.hGroupKey]);

      if (hItem == undefined || hItem == null && vItem === undefined || vItem == null) {
        return false;
      }

      let found = vItem.toLowerCase() === vValue.toLowerCase() && hItem.toLowerCase() === hValue.toLowerCase();
      // if (found) {
      // console.log("Found item: ", found, item)
      // }
      return found;
    });

    if (this.showUngroupedInBacklog) {
      items = items.filter(item => item[this.vGroupKey] !== '' && item[this.hGroupKey] !== '');
    }

    if (this.sortBy !== '') {
      /* Detect datatype of sortBy-Field */
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
    return (this.filter != '') ? items.filter((item, index, array) => {
      return (this.filterOnProperties.length > 0 ? this.filterOnProperties : Object.keys(item)).some(key => {
        const found = item[key] != undefined && typeof (item[key]) != 'number' && ((item[key] as string).indexOf(this.filter) > -1 ? true : false);
        // found && console.info(`Searching "${item[key]}" for "${this.filter}" | Found ${found}`);
        return found;
      });
    }) : items;
  }

  toggleCollapseGroup(direction: string, collapsed: boolean): void {
    const groupKeysToToggle =
      this.collapseStates.filter(item => (direction === 'vertical' ? this.vHeadings : this.hHeadings)
        .some(i => this.getValue(i).toLowerCase() == item.name.toLowerCase()));

    groupKeysToToggle.forEach(item => item.collapsed = !collapsed);
    if (groupKeysToToggle.length > 0) {
      if (direction == 'vertical') {
        this.vCollapsed = !collapsed;
      } else {
        this.hCollapsed = !collapsed;
      }
    }
  }

  getValue(item: string | GroupHeading): string {
    return ((item as GroupHeading).value ? (item as GroupHeading).value : <string>item);
  }

  determineCorrectGroupKeys(item: object): GroupKeys {
    return {
      hGroupKey: this.getCaseInsensitivePropKey(this.items[0], this.hGroupKey),
      vGroupKey: this.getCaseInsensitivePropKey(this.items[0], this.vGroupKey)
    };
  }

  getCaseInsensitivePropKey(item: object, propKey: string): string {
    if (item) {
      return Object.keys(item).find(
        key => (key != '' && key != null && key != undefined)
          ? key.toLowerCase() === propKey.toLowerCase()
          : false
      );
    }

    return '';
  }

  getHeadingsFromItems(groupKey: string = this.vGroupKey): Array<string> {
    const keys = (this.items as Array<object>).map((item: any) =>
      item[Object.keys(item).find(key => key.toLowerCase() === groupKey.toLowerCase())]
    );


    return keys.filter((elem, pos, arr) => {
      return arr.indexOf(elem) === pos && (this.showUngroupedInBacklog && (elem !== '' && elem != null));
    });
  }

  getUngroupedItems(): Array<CardItem> | Array<object> {
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

  toggleCollapse(group: { hGroup: string, vGroup: string }): void {

    const part = this.getValue(group.hGroup || group.vGroup);
    // console.log("Toggle: " + part);

    const collapseState = this.collapseState(part);
    this.collapseStates.find(item => item.name === part).collapsed = !collapseState;
  }

  collapseState(part: string | GroupHeading): boolean {

    if (typeof (part) == 'object') {
      part = (part as GroupHeading).value;
    }

    let foundCollapsedState = this.collapseStates.find(item => item.name === this.getValue(part)).collapsed;
    // console.log('collapseState', part, foundCollapsedState);

    return foundCollapsedState;
  }

  public dragStart(event: DragEvent, item: CardItem) {
    this.dragItem = item;
    this.dragStarted.emit(this.dragItem);
  }

  public dragEnd(event: DragEvent, item: CardItem) {
    this.dragItem = undefined;

  }

  createElement(group: ClickEvent) {
    this.elementCreateClick.emit(group);
  }

  public drop(event: DragEvent, vRow: string, hRow: string) {
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

    this.dragItem[groupKeys.vGroupKey] = vRow;
    this.dragItem[groupKeys.hGroupKey] = hRow;

    this.dropped.emit(this.dragItem);
    this.dragItem = undefined;
  }

  public dragOver(event: DragEvent, vRow: string, hRow: string) {
    if (this.dragItem) {
      event.preventDefault();

      if (vRow == undefined) {
        vRow = '';
      }

      if (hRow == undefined) {
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

  containerIsScrollable(containerName: string): Scrollable {
    let container = this.elRef.nativeElement.querySelector(containerName);
    if (container) {
      let hasHorizontalScrollbar = container.scrollWidth > container.clientWidth;
      let hasVerticalScrollbar = container.scrollHeight > container.clientHeight;

      return {
        hScroll: hasHorizontalScrollbar,
        vScroll: hasVerticalScrollbar
      };
    }
    return null;
  }

  scrollBarStyle(): object {

    return {
      'padding-right': `${this.calculateScrollBarWidth()}px`
    };
  }

  getColumnWidth(): object {
    if (!this.scrollable) { return {}; }

    return {
      'min-width': `${this.columnWidth}px`
    };
  }

  calculateScrollBarWidth(): number {
    const headingsRowWidth = this.elRef.nativeElement.querySelector('.headings').clientWidth;
    const contentWidth = this.elRef.nativeElement.querySelector('.row-content').clientWidth;
    return headingsRowWidth - contentWidth;
  }

  createPlaceholderElement(id: string): HTMLElement {
    if (this.dragoverPlaceholderTemplate) {
      return this.dragoverPlaceholderTemplate.elementRef.nativeElement.cloneNode(true);
    } else {
      const placeholderElement: HTMLElement = this.renderer.createElement('div');
      this.renderer.setStyle(placeholderElement, 'border', '1px dashed gray');
      this.renderer.setStyle(placeholderElement, 'width', '100%');
      this.renderer.setStyle(placeholderElement, 'height', '50px');
      this.renderer.setAttribute(placeholderElement, 'id', this.currentDragZone);
      this.renderer.setAttribute(placeholderElement, 'class', 'placeholder');

      return placeholderElement;
    }
  }
}
