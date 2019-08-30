import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GroupHeading } from 'projects/ngx-taskboard-lib/src/lib/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public showcaseMode = true;

  public hGroupKey = 'name';
  public vGroupKey = 'status';

  public hGroupKeys: Array<GroupHeading> = [
    { value: 'open', color: '#fff', display: 'TEST', orderId: 0 },
    { value: 'working', color: '#fff', display: 'TEST', orderId: 0 },
    { value: 'closed', color: '#fff', display: 'TEST', orderId: 0 },
    { value: 'pending', color: '#fff', display: 'TEST', orderId: 0 },
    { value: 'test', color: '#fff', display: 'TEST', orderId: 0 }
  ];
  public vGroupKeys = [
    { value: 'Karina', color: '#fff', display: 'MF', orderId: 0 },
    { value: 'Christoph', color: '#fff', display: 'MF', orderId: 0 },
    { value: 'Daniel', color: '#fff', display: 'MF', orderId: 0 },
    { value: 'Malian', color: '#fff', display: 'MF', orderId: 0 },
    { value: 'Joseph', color: '#fff', display: 'MF', orderId: 0 },
  ];

  // public hGroupKeys = ['open', 'closed', 'working', 'test', 'pending', 'released'];
  // public vGroupKeys = ['Marco', 'Christoph', 'Daniel', 'Malian', 'Joseph'];

  // public hGroupKey = 'status';
  // public vGroupKey = 'name';

  public items: Array<object> = [];

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    this.http.get('https://next.json-generator.com/api/json/get/N1Mv5ylNw').toPromise().then((data: object[]) => {
      this.items = data;
    });

  }
}
