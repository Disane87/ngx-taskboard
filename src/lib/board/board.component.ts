import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, TemplateRef } from '@angular/core';
import { CodegenComponentFactoryResolver } from '@angular/core/src/linker/component_factory_resolver';
import { CardItem, CollapseState, ClickEvent, GroupKeys, } from '../types';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ngx-taskboard',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  /** Shows the blacklog on onit */
  @Input() showBacklog: boolean = true;

  /** Name of the backlog row */
  @Input() backlogName: string = 'Backlog';

  /** Items to display */
  @Input() items: Array<CardItem> | Array<object> = [];

  /**
   * Grouping keys for columns (if not passed, the keys will be determined out of the items)
   * Caution: If you don't pass any headings manually, only the columns are shown, which have data.
   * If you want to show emtpy rows, please set them
   */
  @Input() hGroupKeys: Array<string> = [];

  /**
   * Grouping keys for rows (if not passed, the keys will be determined out of the items)
   * Caution: If you don't pass any headings manually, only the rows are shown, which have data.
   * If you want to show emtpy rows, please set them
   */
  @Input() vGroupKeys: Array<string> = [];

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
  @Input() hHeaderClass: string = 'card-header';

  /** Default css class for cell header */
  @Input() cellClass: string = 'card-header';

  /**
   * If set to true, the rows and columns are scrollable and will be out of the viewport.
   * If not set, all rows and column will only use 100% of the parent element (aligned by flex/flex-fill)
   */
  @Input() scrollable: boolean = false;

  /** Allow to collapse the rows */
  @Input() vCollapsable: boolean = true;

  /** Rows are collapsed or not on init */
  @Input() vCollapsed: boolean = false;

  /** Columns are collapsed or not on init */
  @Input() hCollapsed: boolean = false;

  /** Fired when the user drags an item. Current item is passed */
  @Output() readonly dragStarted = new EventEmitter<object>();

  /** Fired when an item is dropped. Current item is passed  */
  @Output() readonly dropped = new EventEmitter<object>();

  /** Fired when an add action is click. Current `ClickEvent` is passed */
  @Output() readonly elementCreateClick = new EventEmitter<ClickEvent>();

  public hHeadings: Array<string> = [];
  public vHeadings: Array<string> = [];

  private readonly collapseStates: Array<CollapseState> = [];
  private dragItem: CardItem;
  private placeholderSet = false;
  private currentDragZone: string;

  constructor(private readonly renderer: Renderer2, private readonly elRef: ElementRef, private readonly cd: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.invertGroupDirection) {
      const vGkey = this.vGroupKey;
      const hGkey = this.hGroupKey;

      this.hGroupKey = vGkey;
      this.vGroupKey = hGkey;
    }

    this.hHeadings = (this.hGroupKeys.length > 0 ? this.hGroupKeys : this.getHeadings(this.hGroupKey));
    this.vHeadings = (this.vGroupKeys.length > 0 ? this.vGroupKeys : this.getHeadings(this.vGroupKey));

    this.collapseStates.push(...this.vHeadings.map(item => ({ name: item, collapsed: !this.vCollapsed })));
    this.collapseStates.push(...this.hHeadings.map(item => ({ name: item, collapsed: !this.hCollapsed })));
  }

  getItemsOfGroup(vValue: string, hValue: string): Array<CardItem> | Array<object> {
    // console.log('getItemsOfGroup', arguments);
    let items = this.items.filter(item => {

      const groupKeys: GroupKeys = this.determineCorrectGroupKeys(item);

      const vItem = item[groupKeys.vGroupKey];
      const hItem = item[groupKeys.hGroupKey];

      if (hItem == undefined) {
        return false;
      }

      if (vItem == undefined) {
        return false;
      }

      return (vItem as string).toLowerCase() === vValue.toLowerCase() &&
        (hItem).toLowerCase() === hValue.toLowerCase();
    });

    if (this.showUngroupedInBacklog) {
      items = items.filter(item => item[this.vGroupKey] !== '' && item[this.hGroupKey] !== '');
    }

    if (this.sortBy !== '') {
      /* Detect datatype of sortBy-Field */
      const fieldType = typeof (items.some(item => items[0][this.sortBy] !== undefined && items[0][this.sortBy] !== null)[this.sortBy]);
      if (fieldType) {
        return items.sort((a, b) => {

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
      } else {
        return items;
      }

    }
    return items;
  }

  toggleCollapseGroup(direction: string, collapsed: boolean): void {
    const groupKeysToToggle = this.collapseStates.filter(item => (direction == 'vertical' ? this.vHeadings : this.hHeadings).some(i => i.toLowerCase() == item.name.toLowerCase()));
    groupKeysToToggle.forEach(item => item.collapsed = !collapsed);
    if (groupKeysToToggle.length > 0) {
      if (direction == 'vertical') {
        this.vCollapsed = !collapsed;
      } else {
        this.hCollapsed = !collapsed;
      }
    }
  }

  determineCorrectGroupKeys(item: object): GroupKeys {
    return {
      hGroupKey: this.getCaseInsensitivePropKey(this.items[0], this.hGroupKey),
      vGroupKey: this.getCaseInsensitivePropKey(this.items[0], this.vGroupKey)
    };
  }

  getCaseInsensitivePropKey(item: object, propKey: string): string {
    return Object.keys(item).find(key => key.toLowerCase() === propKey.toLowerCase());
  }

  getHeadings(groupKey: string = this.vGroupKey): Array<string> {
    const keys = (this.items as Array<object>).map((item: any) =>
      item[Object.keys(item).find(key => key.toLowerCase() === groupKey.toLowerCase())]
    );

    return keys.filter((elem, pos, arr) => {
      return arr.indexOf(elem) === pos && (this.showUngroupedInBacklog && elem !== '');
    });
  }

  getUngroupedItems(): Array<CardItem> | Array<object> {
    if (this.showUngroupedInBacklog) {
      return this.items.filter(item => {
        const groupKeys: GroupKeys = this.determineCorrectGroupKeys(item);
        const isUngrouped = (item[groupKeys.vGroupKey] === '' && item[groupKeys.hGroupKey] === '') || (item[groupKeys.vGroupKey] === null && item[groupKeys.hGroupKey] === null);
        return isUngrouped;
      });
    }

    return [];
  }

  toggleCollapse(group: { hGroup: string, vGroup: string }): void {

    const part = group.hGroup || group.vGroup;

    const collapseState = this.collapseState(part);
    this.collapseStates.find(item => item.name === part).collapsed = !collapseState;
    // console.log("Toggle: "+part);
  }

  collapseState(part: string): boolean {
    return this.collapseStates.find(item => item.name === part).collapsed;
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
