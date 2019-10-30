import { Directive, ElementRef, EventEmitter, Input, NgZone, Output, OnDestroy } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { DomEventsPlugin } from '@angular/platform-browser/src/dom/events/dom_events';

@Directive({
	selector: '[outSideEventHandler]'
  })
  export class OutSideEventHandlerDirective implements OnDestroy {
	ngOnDestroy(): void {
		this.el.nativeElement.removeEventListener(this.event, this.handler);
	}
	@Input() public event = 'click';
	@Output('outSideEventHandler') public emitter = new EventEmitter();
	private handler: (any) => void;
	constructor(private _ngZone: NgZone, private el: ElementRef) {}

	ngOnInit() {
	  this._ngZone.runOutsideAngular(() => {
		const nativeElement = this.el.nativeElement;
		this.handler = $event => {
		  this.emitter.emit($event);
		};


		nativeElement.addEventListener(this.event, this.handler, false);
	  });
	}
  }
