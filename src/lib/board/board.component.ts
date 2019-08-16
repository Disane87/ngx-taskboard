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

  @Input() showBacklog = true;
  @Input() backlogName = 'Backlog';
  @Input() items: CardItem[] | object[] = [];

  @Input() hGroupKeys: string[] = [];
  @Input() vGroupKeys: string[] = [];

  @Input() hAddNewItems = true;
  @Input() vAddNewItems = true;
  @Input() cellAddNewItems = true;

  @Input() vGroupKey = '';
  @Input() hGroupKey = '';
  @Input() sortBy = '';
  @Input() boardName = '';

  @Input() invertGroupDirection = false;
  @Input() showUngroupedInBacklog = true;
  @Input() smallText = false;

  @Input() itemTemplate: TemplateRef<any>;
  @Input() noElementsTemplate: TemplateRef<any>;
  @Input() hHeaderTemplate: TemplateRef<any>;
  @Input() vHeaderTemplate: TemplateRef<any>;
  @Input() actionsTemplate: TemplateRef<any>;
  @Input() dragoverPlaceholderTemplate: TemplateRef<any>;

  @Input() vHeaderClass = 'card-header';
  @Input() hHeaderClass = 'card-header';
  @Input() cellClass = 'card-header';

  @Input() scrollable = false;
  @Input() vCollapsable = true;

  @Input() vCollapsed = false;
  @Input() hCollapsed = false;

  @Output() dragStarted = new EventEmitter<object>();
  @Output() dropped = new EventEmitter<object>();
  @Output() elementCreateClick = new EventEmitter<ClickEvent>();

  public hHeadings: string[] = [];
  public vHeadings: string[] = [];

  private collapseStates: CollapseState[] = [];
  private dragItem: CardItem;
  private placeholderSet = false;
  private currentDragZone: string;

  constructor(private renderer: Renderer2, private elRef: ElementRef, private cd: ChangeDetectorRef) { }

  /**
   * 
   * 
   * 
   * @memberOf BoardComponent
   */
  ngOnInit() {
    if (this.invertGroupDirection) {
      const vGkey = this.vGroupKey;
      const hGkey = this.hGroupKey;

      this.hGroupKey = vGkey;
      this.vGroupKey = hGkey;
    }

    this.hHeadings = (this.hGroupKeys.length > 0 ? this.hGroupKeys : this.getHeadings(this.hGroupKey));
    this.vHeadings = (this.vGroupKeys.length > 0 ? this.vGroupKeys : this.getHeadings(this.vGroupKey));
    this.collapseStates.push(...[...this.vHeadings, ...this.hHeadings].map(item => ({ name: item, collapsed: false })));
  }

  /**
   * 
   * 
   * @param {string} vValue 
   * @param {string} hValue 
   * @returns {(CardItem[] | object[])} 
   * 
   * @memberOf BoardComponent
   */
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

  /**
   * 
   * 
   * @param {string} direction 
   * @param {boolean} collapsed 
   * 
   * @memberOf BoardComponent
   */
  toggleCollapseGroup(direction: string, collapsed: boolean): void {
    const groupKeysToToggle = this.collapseStates.filter(item => (direction == 'vertical'  ? this.vHeadings : this.hHeadings).some(i => i.toLowerCase() == item.name.toLowerCase()));
    groupKeysToToggle.forEach(item => item.collapsed = !collapsed);
    if(groupKeysToToggle.length > 0){
      if(direction == 'vertical'){
        this.vCollapsed = !collapsed;
      }else{
        this.hCollapsed = !collapsed;
      }
    }
  }

  /**
   * 
   * 
   * @param {object} item 
   * @returns {GroupKeys} 
   * 
   * @memberOf BoardComponent
   */
  determineCorrectGroupKeys(item: object): GroupKeys {
    return {
      hGroupKey: this.getCaseInsensitivePropKey(this.items[0], this.hGroupKey),
      vGroupKey: this.getCaseInsensitivePropKey(this.items[0], this.vGroupKey)
    };
  }

  /**
   * 
   * 
   * @param {object} item 
   * @param {string} propKey 
   * @returns {string} 
   * 
   * @memberOf BoardComponent
   */
  getCaseInsensitivePropKey(item: object, propKey: string): string {
    return Object.keys(item).find(key => key.toLowerCase() === propKey.toLowerCase());
  }

  /**
   * 
   * 
   * @param {string} [groupKey=this.vGroupKey] 
   * @returns {string[]} 
   * 
   * @memberOf BoardComponent
   */
  getHeadings(groupKey: string = this.vGroupKey): string[] {
    const keys = (<object[]>this.items).map((item: any) =>
      item[Object.keys(item).find(key => key.toLowerCase() === groupKey.toLowerCase())]
    );

    return keys.filter((elem, pos, arr) => {
      return arr.indexOf(elem) === pos && (this.showUngroupedInBacklog && elem !== '');
    });
  }

  /**
   * 
   * 
   * @returns {(CardItem[] | object[])} 
   * 
   * @memberOf BoardComponent
   */
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

  /**
   * 
   * 
   * @param {{ hGroup: string, vGroup: string }} group 
   * 
   * @memberOf BoardComponent
   */
  toggleCollapse(group: { hGroup: string, vGroup: string }): void {


    const part = group.hGroup || group.vGroup;

    const collapseState = this.collapseState(part);
    this.collapseStates.find(item => item.name === part).collapsed = !collapseState;
    // console.log("Toggle: "+part);
  }

  /**
   * 
   * 
   * @param {string} part 
   * @returns {boolean} 
   * 
   * @memberOf BoardComponent
   */
  collapseState(part: string): boolean {
    return this.collapseStates.find(item => item.name === part).collapsed;
  }

  /**
   * 
   * 
   * @param {DragEvent} event 
   * @param {CardItem} item 
   * 
   * @memberOf BoardComponent
   */
  public dragStart(event: DragEvent, item: CardItem) {
    this.dragItem = item;
    this.dragStarted.emit(this.dragItem);
  }

  /**
   * 
   * 
   * @param {DragEvent} event 
   * @param {CardItem} item 
   * 
   * @memberOf BoardComponent
   */
  public dragEnd(event: DragEvent, item: CardItem) {
    this.dragItem = undefined;

  }


  /**
   * 
   * 
   * @param {ClickEvent} group 
   * 
   * @memberOf BoardComponent
   */
  createElement(group: ClickEvent) {
    this.elementCreateClick.emit(group);
  }


  /**
   * 
   * 
   * @param {DragEvent} event 
   * @param {string} vRow 
   * @param {string} hRow 
   * 
   * @memberOf BoardComponent
   */
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

  /**
   * 
   * 
   * @param {DragEvent} event
   * @param {string} vRow
   * @param {string} hRow 
   * 
   * @memberOf BoardComponent
   */
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

  /**
   * 
   * 
   * @param {string} id 
   * @returns {HTMLElement} 
   * 
   * @memberOf BoardComponent
   */
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
