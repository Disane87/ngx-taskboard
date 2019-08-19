# ngx-taskboard 
![badge](https://api.codeclimate.com/v1/badges/e7183f0854e6cf832261/maintainability) [![codecov](https://codecov.io/gh/Disane87/ngx-taskboard/branch/master/graph/badge.svg)](https://codecov.io/gh/Disane87/ngx-taskboard) ![badge](https://img.shields.io/npm/v/@disane/ngx-taskboard) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@disane/ngx-taskboard)

`ngx-taskboard` is an implemention of my on taskboard, because all other taskboards are not that what I need. Feel free to contribute or leave some important feedback! Head over to the [issues](https://github.com/Disane87/ngx-taskboard/issues) when you have questions or found a bug or leave a PR if you have som additions. Styling is made with [Bootstrap](https://github.com/twbs/bootstrap), so it's 100% compatible.


# Table of Content
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- END doctoc -->

- [Description](#description)
- [Dependencies](#dependencies)
- [Installation](#installation)
- [Basic usage](#basic-usage)
  - [Configuration](#configuration)
    - [Properties](#properties)
    - [Events](#events)
  - [Interfaces](#interfaces)
  - [Examples](#examples)
- [Limitations](#limitations)
- [Contributing](#contributing)
  - [Installation](#installation-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Description


![Taskboard](https://github.com/Disane87/ngx-taskboard/blob/master/docs/images/taskboard.gif)



# Dependencies
* Angular 7
* Bootstrap 4

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

<!-- Start AutoDoc components.name=BoardComponent.inputsClass  -->
<!-- End AutoDoc components.name=BoardComponent.inputsClass -->

### Events

<!-- Start AutoDoc components.name=BoardComponent.outputsClass -->
| Name               | Default value                        | Description                                                      | Type         |
| ------------------ | ------------------------------------ | ---------------------------------------------------------------- | ------------ |
| dragStarted        | new EventEmitter&lt;object&gt;()     | Fired when the user drags an item. Current item is passed        | EventEmitter |
| dropped            | new EventEmitter&lt;object&gt;()     | Fired when an item is dropped. Current item is passed            | EventEmitter |
| elementCreateClick | new EventEmitter&lt;ClickEvent&gt;() | Fired when an add action is click. Current ClickEvent is passed  | EventEmitter |

<!-- End AutoDoc components.name=BoardComponent.outputsClass -->

## Interfaces
<!-- Start AutoDoc Interfaces -->
<!-- End AutoDoc Interfaces -->


## Examples
Following soon

# Limitations
- Scrolling actually not possible


# Contributing

## Installation

```bash
git clone https://github.com/Disane87/ngx-taskboard.git .
```

Since this is a Angular library, you have can't start it as standalone, like a normal Angular application. Instead, you have to build it with `ng build . --watch` and link it with `npm link`. The link process creates a symlink to your global `npm` which you can access from other projects.

In your test or real project, you have to add the package, but only with another command `npm link @disane/ngx-taskboard --save`. This means, you are not obtaining the package from `npm`, instead you are symlinking it to you global `npm` which has a reference to the above created link in your project.

This is a bit odd, but you can read more about it [here](https://docs.npmjs.com/cli/link).


If you have an existing Angular library project with a tets application, you can work here with [submoduling](https://github.blog/2016-02-01-working-with-submodules/) in git, instead of a `git clone`:

`git submodule add https://github.com/Disane87/ngx-taskboard.git`

And now, have some fun! 😊 can work here with [submoduling](https://github.blog/2016-02-01-working-with-submodules/) in git, instead of a `git clone`:

`git submodule add https://github.com/Disane87/ngx-taskboard.git`

And now, have some fun! 😊