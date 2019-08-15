import { Component, OnInit, Input, Output, EventEmitter, Renderer2, ElementRef, TemplateRef } from '@angular/core';
import { CardItem, CollapseState } from '../types';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ngx-taskboard',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() showBacklog = true;
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

  @Input() vHeaderClass = 'card-header';
  @Input() hHeaderClass = 'card-header';
  @Input() cellClass = 'card-header';

  @Input() vCollapsable = true;

  @Output() dragStarted = new EventEmitter<object>();
  @Output() dropped = new EventEmitter<object>();
  @Output() elementCreateClick = new EventEmitter<string>();

  public hHeadings: string[] = [];
  public vHeadings: string[] = [];

  private collapseStates: CollapseState[] = [];
  private dragItem: CardItem;
  private placeholderSet = false;
  private currentDragZone: string;

  constructor(private renderer: Renderer2, private elRef: ElementRef) { }

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

  getItemsOfGroup(vValue: string, hValue: string): CardItem[] | object[] {
    let items = this.items.filter(item => {

      const hProp = this.getCaseInsensitivePropKey(item, this.hGroupKey);
      const vProp = this.getCaseInsensitivePropKey(item, this.vGroupKey);

      return (item[vProp] as string).toLowerCase() === vValue.toLowerCase() &&
        (item[hProp] as string).toLowerCase() === hValue.toLowerCase();
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
      return this.items.filter(item => item[this.vGroupKey] === '' && item[this.hGroupKey] === '');
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


  createElement(group: string) {
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

    this.dragItem[this.vGroupKey.toLowerCase()] = vRow;
    this.dragItem[this.hGroupKey.toLowerCase()] = hRow;

    this.dropped.emit(this.dragItem);
    this.dragItem = undefined;
  }

  public dragOver(event: DragEvent, vRow: string, hRow: string) {
    if (this.dragItem) {
      event.preventDefault();

      if (`${vRow}-${hRow.replace(' ', '')}`.toLowerCase() !== this.currentDragZone && this.currentDragZone !== '') {
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

  createPlaceholderElement(id: string) {
    const placeholderElement = this.renderer.createElement('div');
    this.renderer.setStyle(placeholderElement, 'border', '1px dashed gray');
    this.renderer.setStyle(placeholderElement, 'width', '100%');
    this.renderer.setStyle(placeholderElement, 'height', '50px');
    this.renderer.setAttribute(placeholderElement, 'id', this.currentDragZone);
    this.renderer.setAttribute(placeholderElement, 'class', 'placeholder');

    return placeholderElement;
  }
}

export interface ClickEvent {
  hGroup: string;
  vGroup: string;
}
