import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public showcaseMode = true;

  public hGroupKey = 'status';
  public vGroupKey = 'name';

  public hGroupKeys = ['open', 'closed', 'working', 'test', 'pending', 'released'];
  public vGroupKeys = [];

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
