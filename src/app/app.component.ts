import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { GroupHeading } from 'projects/ngx-taskboard-lib/src/lib/types';
import { CollapseState } from '@disane/ngx-taskboard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private readonly http: HttpClient) {

  }
  showcaseMode = false;
  hGroupKey = 'status';
  vGroupKey = 'name';

  public collapseState: Array<CollapseState> = [
	{ name: 'm1', collapsed: false },
	{ name: 'm12', collapsed: false },
  ];

  public events: Array<Event> = [];
  hGroupKeys: Array<GroupHeading> = [
	{ value: 'open', color: '#fff', display: 'TEST', orderId: 1 },
	{ value: 'working', color: '#fff', display: 'TEST', orderId: 2 },
	{ value: 'closed', color: '#fff', display: 'TEST', orderId: 3 },
	{ value: 'pending', color: '#fff', display: 'TEST', orderId: 4 },
	{ value: 'test', color: '#fff', display: 'TEST', orderId: 0 }
  ];

  vGroupKeys = [
	{ value: 'Karina', color: '#fff', display: 'MF', orderId: 5 },
	{ value: 'Christoph', color: '#fff', display: 'MF', orderId: 4 },
	{ value: 'Daniel', color: '#fff', display: 'MF', orderId: 3 },
	{ value: 'Malian', color: '#fff', display: 'MF', orderId: 2 },
	{ value: 'm1', color: '#fff', display: 'MF', orderId: 1 },
	{ value: 'm2', color: '#fff', display: 'MF', orderId: 1 },
	{ value: 'm3', color: '#fff', display: 'MF', orderId: 1 },
	{ value: 'm4', color: '#fff', display: 'MF', orderId: 1 },
	{ value: 'm5', color: '#fff', display: 'MF', orderId: 1 },
	{ value: 'm6', color: '#fff', display: 'MF', orderId: 1 },
	{ value: 'm7', color: '#fff', display: 'MF', orderId: 1 },
	{ value: 'm8', color: '#fff', display: 'MF', orderId: 1 },
	{ value: 'm9', color: '#fff', display: 'MF', orderId: 1 },
	{ value: 'm10', color: '#fff', display: 'MF', orderId: 1 },
	{ value: 'm11', color: '#fff', display: 'MF', orderId: 1 },
	{ value: 'm12', color: '#fff', display: 'MF', orderId: 1 },
	{ value: 'm13', color: '#fff', display: 'MF', orderId: 1 },
	{ value: 'm14', color: '#fff', display: 'MF', orderId: 1 }
  ];

  // public items = [{
  //   "id": 2,
  //   "subject": "dolor",
  //   "description": "Minim nisi deserunt deserunt deserunt sit ullamco sunt consectetur dolore esse. Sunt consequat incididunt Lorem esse voluptate nulla magna ipsum amet consequat nostrud tempor pariatur quis. Elit ea ea duis ut reprehenderit. Minim quis sint deserunt adipisicing sint ipsum enim sunt. Dolor do cillum sit deserunt ea voluptate. Aute ea culpa duis est irure.",
  //   "name": "Marco",
  //   "status": "open",
  //   "color": "#977a0f"
  // },
  // {
  //   "id": 3,
  //   "subject": "enim",
  //   "description": "Mollit nisi minim non cupidatat velit laboris laboris deserunt. Dolor qui duis consequat est quis ipsum dolore dolore. Officia amet nulla laboris eu esse. Nisi commodo adipisicing id minim pariatur occaecat sint qui anim velit commodo commodo esse anim. Veniam excepteur id do duis quis consectetur magna reprehenderit incididunt qui exercitation. Excepteur aliquip sint commodo duis dolor incididunt.",
  //   "name": "Christoph",
  //   "status": "open",
  //   "color": "#e342f6"
  // },
  // {
  //   "id": 4,
  //   "subject": "Lorem",
  //   "description": "Et nisi mollit nisi veniam sint do exercitation anim adipisicing dolore qui. Non consectetur aliqua irure ex deserunt nisi laboris commodo officia. Occaecat consequat ad anim excepteur fugiat sit nisi elit occaecat. Deserunt ea Lorem enim est Lorem labore dolore culpa consequat pariatur.",
  //   "name": "Joseph",
  //   "status": "closed",
  //   "color": "#4a7a23"
  // }]

  // public hGroupKeys = ['open', 'closed', 'working', 'test', 'pending', 'released'];
  // public vGroupKeys = ['Marco', 'Christoph', 'Daniel', 'Malian', 'Joseph'];

  // public hGroupKey = 'status';
  // public vGroupKey = 'name';

  items: Array<object> = [];

  catchEvent(name: string, data: object) {
	// this.events[name] = data;
	this.events.push({name, data });
  }

  ngOnInit(): void {

	this.http.get('https://next.json-generator.com/api/json/get/N1Mv5ylNw').toPromise().then((data: Array<object>) => {
		this.items = data;
	});

  }
}

interface Event {
  name: string;
  data: object;
}
