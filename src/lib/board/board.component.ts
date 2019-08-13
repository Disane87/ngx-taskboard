import { Component, OnInit, Input, Output, EventEmitter, Renderer2, ElementRef, TemplateRef } from '@angular/core';
import { CardItem, CollapseState } from '../types';

@Component({
  selector: 'ngx-taskboard',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() showBacklog = true;
  @Input() items: CardItem[] = [];

  @Input() hGroupKeys: string[] = [];
  @Input() vGroupKeys: string[] = [];

  @Input() vGroupKey = '';
  @Input() hGroupKey = '';
  @Input() sortBy = '';

  @Input() invertGroupDirection = false;
  @Input() showUngroupedInBacklog = true;
  @Input() smallText = false;

  @Input() itemTemplate: TemplateRef<any>;
  @Input() noElementsTemplate: TemplateRef<any>;
  @Input() hHeaderTemplate: TemplateRef<any>;
  @Input() vHeaderTemplate: TemplateRef<any>;
  @Input() actionsTemplate: TemplateRef<any>;
  @Input() vCollapsable = true;

  @Output() dragStarted = new EventEmitter<CardItem>();
  @Output() dropped = new EventEmitter<CardItem>();
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
      let vGkey = this.vGroupKey;
      let hGkey = this.hGroupKey;

      this.hGroupKey = vGkey;
      this.vGroupKey = hGkey;
    }
    this.hHeadings = (this.hGroupKeys.length > 0 ? this.hGroupKeys : this.getHeadings(this.hGroupKey));
    this.vHeadings = (this.vGroupKeys.length > 0 ? this.vGroupKeys : this.getHeadings(this.vGroupKey));
    this.collapseStates.push(...[...this.vHeadings, ...this.hHeadings].map(item => ({ name: item, collapsed: false })));
  }

  getItemsOfGroup(vValue: string, hValue: string): CardItem[] {
    let items = this.items.filter(item => item[this.vGroupKey] == vValue && item[this.hGroupKey] == hValue);
    if (this.showUngroupedInBacklog) {
      items = items.filter(item => item[this.vGroupKey] != '' && item[this.hGroupKey] != '')
    }

    if (this.sortBy != '') {
      /* Detect datatype of sortBy-Field */
      let fieldType = typeof (items.some(item => items[0][this.sortBy] !== undefined && items[0][this.sortBy] != null)[this.sortBy]);
      if (fieldType) {
        return items.sort((a, b) => {

          let aField = a[this.sortBy];
          let bField = b[this.sortBy];

          if (fieldType == 'number') {
            return bField - aField;
          }

          if (fieldType == 'string') {
            if (aField < bField) {
              return -1;
            }
            if (aField > bField) {
              return 1;
            }
            return 0;
          }


        })
      } else {
        return items;
      }

    }
    return items;
  }

  getHeadings(groupKey: string = this.vGroupKey): string[] {
    let keys = this.items.map(item => item[Object.keys(item).find(key => key == groupKey)]);

    return keys.filter((elem, pos, arr) => {
      return arr.indexOf(elem) == pos && (this.showUngroupedInBacklog && elem != '');
    });
  }

  getUngroupedItems(): CardItem[] {
    if (this.showUngroupedInBacklog) {
      return this.items.filter(item => item[this.vGroupKey] == '' && item[this.hGroupKey] == '');
    }

    return [];
  }

  toggleCollapse(part: string): void {
    let collapseState = this.collapseState(part);
    this.collapseStates.find(item => item.name == part).collapsed = !collapseState;
    // console.log("Toggle: "+part);
  }

  collapseState(part: string): boolean {
    return this.collapseStates.find(item => item.name == part).collapsed;
  }

  public dragStart(event: DragEvent, item: CardItem) {
    this.dragItem = item;
    this.dragStarted.emit(this.dragItem);
  };

  public dragEnd(event: DragEvent, item: CardItem) {
    this.dragItem = undefined;

  };


  createElement(group: string) {
    this.elementCreateClick.emit(group);
  }


  public drop(event: DragEvent, vRow: string, hRow: string) {
    event.preventDefault();
    if (event.currentTarget) {
      let placeholderEl = (event.currentTarget as HTMLElement).querySelector('.placeholder');
      if (placeholderEl) {
        this.renderer.removeChild(placeholderEl.parentNode, placeholderEl);
      }
      this.currentDragZone = '';
      this.placeholderSet = false;
    }

    this.dragItem[this.vGroupKey] = vRow;
    this.dragItem[this.hGroupKey] = hRow;

    this.dropped.emit(this.dragItem);
    this.dragItem = undefined;
  };

  public dragOver(event: DragEvent, vRow: string, hRow: string) {
    if (this.dragItem) {
      event.preventDefault();

      if (`${vRow}-${hRow.replace(' ', '')}`.toLowerCase() != this.currentDragZone && this.currentDragZone != '') {
        let lastPlaceholder = document.getElementById(this.currentDragZone);
        if (lastPlaceholder) {
          this.renderer.removeChild(lastPlaceholder.parentNode, lastPlaceholder);
          this.placeholderSet = false;
        }
      }

      this.currentDragZone = `${vRow}-${hRow.replace(' ', '')}`.toLowerCase();

      if (!this.placeholderSet) {
        let placeholderElement = this.createPlaceholderElement(this.currentDragZone);
        this.renderer.appendChild(event.currentTarget, placeholderElement);
        this.placeholderSet = true;
      }
    }
  };

  createPlaceholderElement(id: string) {
    let placeholderElement = this.renderer.createElement('div');
    this.renderer.setStyle(placeholderElement, 'border', '1px dashed gray');
    this.renderer.setStyle(placeholderElement, 'width', '100%');
    this.renderer.setStyle(placeholderElement, 'height', '50px');
    this.renderer.setAttribute(placeholderElement, 'id', this.currentDragZone);
    this.renderer.setAttribute(placeholderElement, 'class', 'placeholder');

    return placeholderElement;
  }
}