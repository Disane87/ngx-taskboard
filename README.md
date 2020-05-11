# ngx-taskboard 
![badge](https://api.codeclimate.com/v1/badges/e7183f0854e6cf832261/maintainability) [![codecov](https://codecov.io/gh/Disane87/ngx-taskboard/branch/master/graph/badge.svg)](https://codecov.io/gh/Disane87/ngx-taskboard) ![badge](https://img.shields.io/npm/v/@disane/ngx-taskboard) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@disane/ngx-taskboard) [![Build Status](https://travis-ci.org/Disane87/ngx-taskboard.svg?branch=master)](https://travis-ci.org/Disane87/ngx-taskboard) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

`ngx-taskboard` is an implemention of my on taskboard, because all other taskboards are not that what I need. Feel free to contribute or leave some important feedback! Head over to the [issues](https://github.com/Disane87/ngx-taskboard/issues) when you have questions or found a bug or leave a PR if you have som additions. Styling is made with [Bootstrap](https://github.com/twbs/bootstrap), so it's 100% compatible.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Description](#description)
- [Dependencies](#dependencies)
- [Installation](#installation)
- [Basic usage](#basic-usage)
  - [Configuration](#configuration)
    - [Properties](#properties)
    - [Events](#events)
    - [Interfaces](#interfaces)
  - [Examples](#examples)
    - [Basic examples](#basic-examples)
- [Contributing](#contributing)
  - [Installation the project](#installation-the-project)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Description

![Taskboard](https://github.com/Disane87/ngx-taskboard/blob/master/docs/images/taskboard.gif)

# Dependencies

|  Version | Angular  | Bootstrap  | Status |
|---|---|---|---|---|
|  1.x.x | 7.x.x   | 4.x.x.   | unmaintained   |
|  2.x.x | 8.x.x   | 4.x.x.   | unmaintained   |
|  3.x.x | 9.x.x   | 4.x.x.   | latest   |

# Installation
`npm install @disane/ngx-taskboard`

# Basic usage

`app.module.ts`

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

`app.component.html`

```html
<ngx-taskboard class="w-100 h-100" [items]="items" [hGroupKeys]="hGroupKeys" [vGroupKeys]="vGroupKeys"
  [vGroupKey]="vGroupKey" [hGroupKey]="hGroupKey" [sortBy]="sortBy" [invertGroupDirection]="false">
</ngx-taskboard>
```

`app.component.ts`

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

<!-- Start AutoDoc components-name=BoardComponent-inputsClass -->
| Name                        | Default value                | Description                                                                                                                                                                                                                              | Type                       |
| --------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| actionsTemplate             | null                         | Template for actions, add and collapse buttons (see examples)                                                                                                                                                                            | TemplateRef&lt;any&gt;     |
| backlogName                 | 'Backlog'                    | Name of the backlog row                                                                                                                                                                                                                  |                            |
| backlogWidth                | `${this.columnWidth}px`      | Width of the backlog row, when activated. You can use all valid css units. Default is columnWidth                                                                                                                                        |                            |
| boardName                   | ''                           | Board name to show between row and column header                                                                                                                                                                                         |                            |
| cellAddNewItems             | true                         | Show add buttons in the cells for columns and rows                                                                                                                                                                                       |                            |
| cellClass                   | 'card-header'                | Default css class for cell header                                                                                                                                                                                                        |                            |
| columnWidth                 | 200                          | Column width (in px) which is applied to the columns when the content is scollable                                                                                                                                                       |                            |
| dragoverPlaceholderTemplate | null                         | Template for the placeholder element which will be generated when an item is draged over a cell                                                                                                                                          | TemplateRef&lt;any&gt;     |
| filter                      | ''                           | Predefined filter for the searchbar. If set, the items are filtered by the term on init.                                                                                                                                                 |                            |
| filterOnProperties          | []                           | Specify the properties which will be searched for the given termin filter. If not properties are given, all will be searched                                                                                                             | string[]                   |
| filterRowPlaceholder        | 'Search for items'           | Placeholder for the input with the filter row                                                                                                                                                                                            |                            |
| hAddNewItems                | true                         | Show add buttons on the column headings                                                                                                                                                                                                  |                            |
| hCollapsed                  | false                        | Columns are collapsed or not on init                                                                                                                                                                                                     |                            |
| hGroupKey                   | ''                           | Key to group data for columns                                                                                                                                                                                                            |                            |
| hGroupKeys                  | []                           | Grouping keys for columns (if not passed, the keys will be determined out of the items)Caution: If you don&#39;t pass any headings manually, only the columns are shown, which have data.If you want to show emtpy rows, please set them | (string \| GroupHeading)[] |
| hHeaderClass                | 'card-header card-header-bg' | Default css class for column header                                                                                                                                                                                                      |                            |
| hHeaderTemplate             | null                         | Template for column headers. Current groupName will be passed (see examples)                                                                                                                                                             | TemplateRef&lt;any&gt;     |
| initialCollapseState        | []                           | The collapse state which is applied when set initially                                                                                                                                                                                   | CollapseState[]            |
| invertGroupDirection        | false                        | Invert rows and columns                                                                                                                                                                                                                  |                            |
| items                       |                              |                                                                                                                                                                                                                                          | []                         |
| itemTemplate                | null                         | Template for items to render. &quot;item&quot; object ist passed (see examples)                                                                                                                                                          | TemplateRef&lt;any&gt;     |
| noElementsTemplate          | null                         | Template for collapsed rows to render. &quot;count&quot; object ist passed (see examples)                                                                                                                                                | TemplateRef&lt;any&gt;     |
| showBacklog                 | true                         | Shows the blacklog on onit                                                                                                                                                                                                               |                            |
| showFilterRow               | true                         | Shows the filter row to search items by filter in filterOnProperties array                                                                                                                                                               |                            |
| showUngroupedInBacklog      | true                         | All items which can&#39;t be grouped into rows and columns are stored into the backlog                                                                                                                                                   |                            |
| smallText                   | false                        | Decrease overall font size                                                                                                                                                                                                               |                            |
| sortBy                      | ''                           | Sort items by property                                                                                                                                                                                                                   |                            |
| stickyHorizontalHeaderKeys  | true                         | If set to true, the horizontal group keys are fixed positioned to the top and remain at the top while scrolling. Only applied when scrollable is true                                                                                    |                            |
| stickyVerticalHeaderKeys    | false                        | If set to true, the vertical group keys are fixed positioned to the top and remain at the top while scrolling. Only applied when scrollable is true                                                                                      |                            |
| vAddNewItems                | true                         | Show add buttons on the row headings                                                                                                                                                                                                     |                            |
| vCollapsable                | true                         | Allow to collapse the rows                                                                                                                                                                                                               |                            |
| vCollapsed                  | false                        | Rows are collapsed or not on init                                                                                                                                                                                                        |                            |
| vGroupKey                   | ''                           | Key to group data for rows                                                                                                                                                                                                               |                            |
| vGroupKeys                  | []                           | Grouping keys for rows (if not passed, the keys will be determined out of the items)Caution: If you don&#39;t pass any headings manually, only the rows are shown, which have data.If you want to show emtpy rows, please set them       | (string \| GroupHeading)[] |
| vHeaderClass                | 'card-header'                | Default css class for row header                                                                                                                                                                                                         |                            |
| vHeaderTemplate             | null                         | Template for row headers. Current groupName will be passed (see examples)                                                                                                                                                                | TemplateRef&lt;any&gt;     |

<!-- End AutoDoc components-name=BoardComponent-inputsClass -->

### Events

<!-- Start AutoDoc components-name=BoardComponent-outputsClass -->
| Name               | Default value                           | Description                                                      | Type         |
| ------------------ | --------------------------------------- | ---------------------------------------------------------------- | ------------ |
| dragStarted        | new EventEmitter&lt;object&gt;()        | Fired when the user drags an item. Current item is passed        | EventEmitter |
| dropped            | new EventEmitter&lt;DropEvent&gt;()     | Fired when an item is dropped. Current item is passed            | EventEmitter |
| elementCreateClick | new EventEmitter&lt;ClickEvent&gt;()    | Fired when an add action is click. Current ClickEvent is passed  | EventEmitter |
| headingCollapsed   | new EventEmitter&lt;CollapseEvent&gt;() | Fired when a heading is collapsed. CollapseEvent is emitted      | EventEmitter |
| isScrolling        | new EventEmitter<ScrollEvent>()         |                                                                  | EventEmitter |
| scrolledToEnd      | new EventEmitter<ScrollEvent>()         |                                                                  | EventEmitter |
| scrollEnded        | new EventEmitter<ScrollEvent>()         |                                                                  | EventEmitter |

<!-- End AutoDoc components-name=BoardComponent-outputsClass -->

### Interfaces
<!-- Start AutoDoc Interfaces -->
| Name          | Type      | Description                                                         |
| ------------- | --------- | ------------------------------------------------------------------- |
| CardItem      | interface | Item to render                                                      |
| ClickEvent    | interface | Datatype which is emitted when an item should be added              |
| CollapseEvent | interface | Object for the headings in which you can set color etc.             |
| CollapseState | interface | All the collapse stated of every group item (horizontal / vertical) |
| DropEvent     | interface | Event which is fired when an item is dropped                        |
| GroupHeading  | interface | Object for the headings in which you can set color etc.             |
| GroupKeys     | interface | Group keys to determine the correct groups internally               |
| Scrollable    | interface | Object to determine the scrollability                               |
| ScrollEvent   | interface |                                                                     |

<!-- End AutoDoc Interfaces -->

## Examples

### Basic examples
https://stackblitz.com/edit/disane-ngx-taskboard?embed=1&file=src/app/app.component.html&hideExplorer=1&hideNavigation=1&view=preview

# Contributing

## Installation the project

```bash
git clone https://github.com/Disane87/ngx-taskboard.git .
```

Installing deps:
```bash
npm install
```


If you use [Visual Studio Code](https://code.visualstudio.com/), just use the included `ngx-taskboard.code-workspace`, install recommended extensions and hit `F5` to debug.

And now, have some fun! 😊