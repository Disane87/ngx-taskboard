![badge](https://api.codeclimate.com/v1/badges/e7183f0854e6cf832261/maintainability) [![codecov](https://codecov.io/gh/Disane87/ngx-taskboard/branch/master/graph/badge.svg)](https://codecov.io/gh/Disane87/ngx-taskboard) ![badge](https://img.shields.io/npm/v/@disane/ngx-taskboard) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@disane/ngx-taskboard)

## Description
`ngx-taskboard` is an implemention of my on taskboard, because all other taskboards are not that what I need. Feel free to contribute or leave some important feedback! Head over to the [issues](https://github.com/Disane87/ngx-taskboard/issues) when you have questions or found a bug or leave a PR if you have som additions. Styling is made with [Bootstrap](https://github.com/twbs/bootstrap), so it's 100% compatible.

![Taskboard](https://github.com/Disane87/ngx-taskboard/blob/master/docs/images/taskboard.gif)

## Dependency
- Angular 7
- Bootstrap

## Installation
`npm install @disane/ngx-taskboard`

## Basic usage

app.module.ts
```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxTaskboardModule } from '@disane/ngx-taskboard';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, NgxTaskboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

app.component.html
```html
<ngx-taskboard class="w-100 h-100" [items]="items" [hGroupKeys]="hGroupKeys" [vGroupKeys]="vGroupKeys"
  [vGroupKey]="vGroupKey" [hGroupKey]="hGroupKey" [sortBy]="sortBy" [invertGroupDirection]="false">
</ngx-taskboard>
```

app.component.ts
```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public items = [
    { id: 1, name: 'Evaluate', color: '#fb3064', status: 'open', user: 'Marco', priority: 1 },
    { id: 2, name: 'Call customer', color: '#71dd8f', status: 'working', user: 'Jamie', priority: 1 },
    { id: 3, name: 'Fix bugs', color: '#29aa82', status: 'open', user: 'Malian', priority: 1 },
    { id: 3, name: 'Create SCSS', color: '#e14a2f', status: 'open', user: 'Marco', priority: 1 },
    { id: 4, name: 'Boil water', color: '#209ab7', status: 'working', user: 'Marco', priority: 2 },
    { id: 4, name: 'Walking the doggo', color: '#b3f7dd', status: 'done', user: 'Thorsten', priority: 3 },
    { id: 4, name: 'Prepare for xmas', color: '#ea6562', status: '', user: '' },
    { id: 4, name: 'Birthday preps', color: '#b4ade5', status: 'test', user: '', priority: 5 }
  ];

  public vGroupKeys = ['open', 'working', 'test', 'done'];
  public hGroupKeys = ['Marco', 'Jamie', 'Malian', 'Natalie', 'Thorsten'];

  public vGroupKey = 'status';
  public hGroupKey = 'user';
  public sortBy = 'priority';

}

```

## Configuration
### Properties
| Property               |       Default        | Description                                                                                                 |
| ---------------------- | :------------------: | ----------------------------------------------------------------------------------------------------------- |
| showBacklog            |         true         | Shows the backlog                                                                                           |
| backlogName            |      'Backlog'       | Name of the backlog row                                                                                     |
| items                  |          []          | Items from type `CardItem[]` or `object[]`                                                                  |
| vGroupKey              |          ''          | Group vertical items by field '<xyz>'                                                                       |
| hGroupKey              |          ''          | Group horizontal items by field '<xyz>'                                                                     |
| vGroupKeys             |          []          | Group keys which are shown vertically '<xyz>', without, the values of property `vGroupKey` in items is used |
| hGroupKeys             |          []          | Group keys which are shown vertically '<xyz>', without, the values of property `hGroupKey` in items is used |
| invertGroupDirection   |        false         | Inverts the horizontal and vertical axis                                                                    |
| showUngroupedInBacklog |         true         | Items with no value in `vGroupKey` and `hGroupKey` are "ungrouped" and shown in backlog                     |
| smallText              |        false         | Increased font size                                                                                         |
| itemTemplate           | null `<TemplateRef>` | Template for customizing the Items shown. See examples                                                      |
| noElementsTemplate     | null `<TemplateRef>` | Template for customizing for collapsed items. See examples                                                  |
| hHeaderTemplate        | null `<TemplateRef>` | Template for horizontal headers. See examples                                                               |
| vHeaderTemplate        | null `<TemplateRef>` | Template for vertical headers. See examples                                                                 |
| actionsTemplate        | null `<TemplateRef>` | Template for actions. See examples                                                                          |
| vCollapsable           |         true         | Groups can be collapsed                                                                                     |
| hAddNewItems           |         true         | New item icon (horizontal)                                                                                  |
| vAddNewItems           |         true         | New item icon (vertical)                                                                                    |
| cellAddNewItems        |         true         | New item icon (cell)                                                                                        |
| vHeaderClass           |    'card-header'     | CSS class for vertical header                                                                               |
| hHeaderClass           |    'card-header'     | CSS class for horizontal header                                                                             |
| cellClass              |    'card-header'     | CSS class for cells                                                                                         |
| boardName              |          ''          | Will be displayed between vertical and horizontal headers                                                   |

  
### Events
| Event              |        ParamType        | Description                                                       |
| ------------------ | :---------------------: | ----------------------------------------------------------------- |
| dragStarted        | `CardItem[] | object[]` | Fired when the user drags an item. Current item is passed         |
| dropped            | `CardItem[] | object[]` | Fired when an item is dropped. Current item is passed             |
| elementCreateClick |      `ClickEvent`       | Fired when an add action is click. `Current ClickEvent` is passed |

### Datatypes
#### CardItem
```ts
export interface CardItem {
    id: number;
    name: string;
    status?: string;
    color?: string;
    user?: string;
    priority?: number;
}
```
#### ClickEvent
```ts
export interface ClickEvent {
  hGroup: string; 
  vGroup: string;
}
```

## Examples
Following soon

## Limitations
- Scrolling actually not possible
