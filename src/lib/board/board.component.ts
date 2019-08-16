import { Component, OnInit, Input, Output, EventEmitter, Renderer2, ElementRef, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { CardItem, CollapseState } from '../types';
import { CodegenComponentFactoryResolver } from '@angular/core/src/linker/component_factory_resolver';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ngx-taskboard',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  /** Shows the blacklog on onit */
  @Input() showBacklog = true;

  /** Name of the backlog row */
  @Input() backlogName = 'Backlog';

  /** Items to display */
  @Input() items: CardItem[] | object[] = [];

  /** 
   * Grouping keys for columns (if not passed, the keys will be determined out of the items)
   * Caution: If you don't pass any headings manually, only the columns are shown, which have data.
   * If you want to show emtpy rows, please set them
   */
  @Input() hGroupKeys: string[] = [];

  /** 
   * Grouping keys for rows (if not passed, the keys will be determined out of the items)
   * Caution: If you don't pass any headings manually, only the rows are shown, which have data.
   * If you want to show emtpy rows, please set them
   */
  @Input() vGroupKeys: string[] = [];

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
  @Input() itemTemplate: TemplateRef<any>;

  /** Template for collapsed rows to render. "count" object ist passed (see examples) */
  @Input() noElementsTemplate: TemplateRef<any>;

  /** Template for column headers. Current groupName will be passed (see examples) */
  @Input() hHeaderTemplate: TemplateRef<any>;

  /** Template for row headers. Current groupName will be passed (see examples) */
  @Input() vHeaderTemplate: TemplateRef<any>;

  /** Template for actions, add and collapse buttons (see examples) */
  @Input() actionsTemplate: TemplateRef<any>;

  /** Template for the placeholder element which will be generated when an item is draged over a cell */
  @Input() dragoverPlaceholderTemplate: TemplateRef<any>;

  /** Default css class for row header */
  @Input() vHeaderClass = 'card-header';

  /** Default css class for column header */
  @Input() hHeaderClass = 'card-header';

  /** Default css class for cell header */
  @Input() cellClass = 'card-header';

  /** 
   * If set to true, the rows and columns are scrollable and will be out of the viewport. 
   * If not set, all rows and column will only use 100% of the parent element (aligned by flex/flex-fill)
   */
  @Input() scrollable = false;

  /** Allow to collapse the rows */
  @Input() vCollapsable = true;

  /** Rows are collapsed or not on init */
  @Input() vCollapsed = false;

  /** Columns are collapsed or not on init */
  @Input() hCollapsed = false;

  @Output() readonly dragStarted = new EventEmitter<object>();
  @Output() readonly dropped = new EventEmitter<object>();
  @Output() readonly elementCreateClick = new EventEmitter<ClickEvent>();

  public hHeadings: Array<string> = [];
  public vHeadings: Array<string> = [];

  private collapseStates: Array<CollapseState> = [];
  private dragItem: CardItem;
  private placeholderSet = false;
  private currentDragZone: string;

  constructor(private renderer: Renderer2, private elRef: ElementRef, private cd: ChangeDetectorRef) { }


  ngOnInit() {
    if (this.invertGroupDirection) {
      const vGkey = this.vGroupKey;
      const hGkey = this.hGroupKey;

      this.hGroupKey = vGkey;
      this.vGroupKey = hGkey;
    }

    this.hHeadings = (this.hGroupKeys.length > 0 ? this.hGroupKeys : this.getHeadings(this.hGroupKey));
    this.vHeadings = (this.vGroupKeys.length > 0 ? this.vGroupKeys : this.getHeadings(this.vGroupKey));


    this.collapseStates.push(...this.vHeadings.map(item => ({ name: item, collapsed: this.vCollapsed })));
    this.collapseStates.push(...this.hHeadings.map(item => ({ name: item, collapsed: this.hCollapsed })));
  }

  getItemsOfGroup(vValue: string, hValue: string): CardItem[] | object[] {
    // console.log('getItemsOfGroup', arguments);
    let items = this.items.filter(item => {

      const groupKeys: GroupKeys = this.determineCorrectGroupKeys(item);

      const vItem = item[groupKeys.vGroupKey];
      const hItem = item[groupKeys.hGroupKey];

      if (hItem == null) {
        return false;
      }

      if (vItem == null) {
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
    const groupKeysToToggle = this.collapseStates.filter(item => (direction == 'vertical'  ? this.vHeadings : this.hHeadings).some(i => i.toLowerCase() == item.name.toLowerCase()));
    groupKeysToToggle.forEach(item => item.collapsed = !collapsed);
    if(groupKeysToToggle.length > 0){
      if(direction == 'vertical'){
        debugger;
        this.vCollapsed = !collapsed;
      }else{
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

  getHeadings(groupKey: string = this.vGroupKey): string[] {
    const keys = (<object[]>this.items).map((item: any) =>
      item[Object.keys(item).find(key => key.toLowerCase() === groupKey.toLowerCase())]
    );

    return keys.filter((elem, pos, arr) => {
      return arr.indexOf(elem) === pos && (this.showUngroupedInBacklog && elem !== '');
    });
  }

  getUngroupedItems(): CardItem[] | object[] {
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

      if (vRow == null) {
        vRow = '';
      }

      if (hRow == null) {
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

export interface ClickEvent {
  hGroup: string;
  vGroup: string;
}


export interface GroupKeys {
  hGroupKey: string;
  vGroupKey: string;
}
