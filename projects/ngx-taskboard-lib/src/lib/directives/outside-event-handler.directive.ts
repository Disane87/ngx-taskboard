import { Directive, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
	selector: '[outSideEventHandler]'
  })
  export class OutSideEventHandlerDirective implements OnDestroy, OnInit {
	constructor(private ngZone: NgZone, private el: ElementRef) {}
	@Input() public event = 'click';
	@Output('outSideEventHandler') public emitter = new EventEmitter();
	private handler: (event: any) => void;
	public ngOnDestroy(): void {
		this.el.nativeElement.removeEventListener(this.event, this.handler);
	}

	public ngOnInit() {
	  this.ngZone.runOutsideAngular(() => {
		const nativeElement = this.el.nativeElement;
		this.handler = $event => {
		  this.emitter.emit($event);
		};


		nativeElement.addEventListener(this.event, this.handler, false);
	  });
	}
  }
