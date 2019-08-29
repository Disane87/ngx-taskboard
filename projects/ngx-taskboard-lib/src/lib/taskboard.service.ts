import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TaskboardService {

  public filterChanged$ = new EventEmitter<string>();
  public objectProperties: string[] = [];

  constructor() { }
}
