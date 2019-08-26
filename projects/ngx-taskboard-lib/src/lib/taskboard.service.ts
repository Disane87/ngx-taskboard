import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskboardService {

  public filterChanged$ = new EventEmitter<string>();
  public objectProperties: Array<string> = [];

  constructor() { }
}
