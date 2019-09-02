import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class TaskboardService {

	filterChanged$ = new EventEmitter<string>();
	objectProperties: Array<string> = [];
}
