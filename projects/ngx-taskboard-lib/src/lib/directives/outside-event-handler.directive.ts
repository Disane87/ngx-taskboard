import { Directive, ElementRef, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { DomEventsPlugin } from '@angular/platform-browser/src/dom/events/dom_events';

@Directive({
	selector: '[outSideEventHandler]'
  })
  export class OutSideEventHandlerDirective {

	@Input() public event = 'click';
	@Output('outSideEventHandler') public emitter = new EventEmitter();
	private _handler: Function;
	constructor(private _ngZone: NgZone, private el: ElementRef) {}

	ngOnInit() {
	  this._ngZone.runOutsideAngular(() => {
		const nativeElement = this.el.nativeElement;
		this._handler = $event => {
		  this.emitter.emit($event);
		};


		nativeElement.addEventListener(this.event, this._handler, false);
	  });
	}

	public ngOnDestory() {
	  this.el.nativeElement.removeEventListener(this.event, this._handler);
	}
  }
