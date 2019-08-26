import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { TaskboardService } from '../taskboard.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DebugRenderer2 } from '@angular/core/src/view/services';

@Component({
  selector: 'ngx-taskboard-filter-search-bar',
  templateUrl: './filter-search-bar.component.html',
  styleUrls: ['./filter-search-bar.component.scss']
})
export class FilterSearchBarComponent implements OnInit {

  public filter: string;
  public filterChanged: Subject<string> = new Subject<string>();
  public filterOnProperties: Array<string> = [];
  public filterOnPropertiesChanged: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();

  @Input() placeholder = 'Search for Items';

  constructor(public taskboardService: TaskboardService) {
    this.filterChanged.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe((filter: string) => {
        this.filter = filter
        this.taskboardService.filterChanged$.emit(filter);
      });
  }

  ngOnInit() {
  }

  changed(text) {
    this.filterChanged.next(text);
  }
}
