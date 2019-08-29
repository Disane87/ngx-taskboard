import { Component, EventEmitter, Input, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { TaskboardService } from "../taskboard.service";

@Component({
  // tslint:disable-next-line: component-selector
  selector: "ngx-taskboard-filter-search-bar",
  templateUrl: "./filter-search-bar.component.html",
  styleUrls: ["./filter-search-bar.component.scss"],
})
export class FilterSearchBarComponent implements OnInit {

  public filter: string;
  public filterChanged: Subject<string> = new Subject<string>();
  public filterOnProperties: string[] = [];
  public filterOnPropertiesChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

  @Input() public placeholder = "Search for Items";

  constructor(public taskboardService: TaskboardService) {
    this.filterChanged.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe((filter: string) => {
        this.filter = filter;
        this.taskboardService.filterChanged$.emit(filter);
      });
  }

  public ngOnInit() {
  }

  public changed(text) {
    this.filterChanged.next(text);
  }
}
