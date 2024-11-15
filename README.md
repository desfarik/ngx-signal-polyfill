# ngx-signal-polyfill

## Overview

**ngx-signal-polyfill** — This library provides support for signals in Angular, offering a range of features to enhance your development experience.

## Version Compatibility

| Angular Version | Library Version |
|-----------------|-----------------|
| 8               | 8.x             |
| 9               | 9.x             |
| 10              | 10.x            |
| 11              | 11.x            |
| >=12            | 12.x            |

## Installation

```bash
npm i ngx-signal-polyfill --save
```

## Setup

Import the SignalPipeModule in your component module(or standalone component)

NgModule:

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyComponent } from './my-component';
import { SignalPipeModule } from 'ngx-signal-polyfill';


@NgModule({
  declarations: [MyComponent],
  imports: [
    CommonModule,
    SignalPipeModule, // add SignalPipeModule to module
  ],
  providers: [],
})
export class MyModule {
}
```

Standalone:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-standalone',
  templateUrl: './standalone.component.html',
  standalone: true,
  imports: [
    CommonModule,
    SignalPipeModule, // add SignalPipeModule to module
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StandaloneComponent {
}
```

## Usage

Use the signal pipe with your signal in your component:

```typescript
import { Component } from '@angular/core';
import { signal } from 'ngx-signal-polyfill';

@Component({
  selector: 'app-counter',
  template: `
  <p>Counter: {{ counter | signal }}</p>
  <div>
    <button (click)="increment()">increment</button>
   </div> 
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent {
  counter = signal(0);

  increment() {
    this.counter.set(this.counter() + 1);
  }
}
```

## Comparison with Original Angular Signals

```typescript

import { Component, signal } from '@angular/core';
import { signal as signalPolyfill } from 'ngx-signal-polyfill';


@Component({
  selector: 'app-counter',
  template: `
  <p>Original Counter: {{ originalCounter() }}</p>
  <p>Polyfill Counter: {{ polyfillCounter | signal }}</p>
  <button (click)="increment()">increment</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent {
  originalCounter = signal(0);
  polyfillCounter = signalPolyfill(0);

  increment() {
    this.originalCounter.set(this.originalCounter() + 1);
    this.polyfillCounter.set(this.polyfillCounter() + 1);
  }
}
```

## API Compatibility

| Feature          | Angular Compatibility                  | Notes                                                  |
|------------------|----------------------------------------|--------------------------------------------------------|
| **Primitives**   |                                        |                                                        |
| `computed`       | ✅ Fully supported                      | Just copied from @angular/core                         |
| `signal`         | ✅ Fully supported                      | Just copied from @angular/core                         |
| `effect`         | ⚠️ Supported only with `manualCleanup` | Copied and adopted to usage in older angular versions. |
| **RxJS Interop** |
| `toObservable`   | ⚠️ Supported only with `manualCleanup` | Copied and adopted to usage in older angular versions. |
| `toSignal`       | ❌ Not supported                        | Coming soon                                            |

## Don't Forget to Unsubscribe

In original Angular, if you use `effect` or `toObservable` in an injection context, you don't need to unsubscribe from it. However, we cannot implement this  ~~automagic~~ **automatic** unsubscribe feature in our polyfill.

Therefore, you need to be careful and remember to manually unsubscribe from `effect` or `toObservable`.

In this regard, I recommend using `toObservable` instead of `effect` because there are many tools available to make automatic RxJS unsubscription easier. Here are some useful tools:

- `Async | pipe`: Automatically handles unsubscription when the component is destroyed.
- [@ngneat/until-destroy](https://www.npmjs.com/package/@ngneat/until-destroy): A decorator that automatically unsubscribes from observables when the component is destroyed.
- `takeUntil(notifier)`: notifier emits value when the component is destroyed.

## Future Plans

• Migration Tool: We plan to develop a migration tool to help you transition to Angular 16, allowing you to replace the polyfill with native signal support.

•  [Signal queries](https://angular.dev/guide/signals/queries) ViewChild and ViewChildren Support: Development is underway to support ViewChild and ViewChildren.

•  [Signal inputs](https://angular.dev/guide/signals/inputs) Signal inputs: Input Signal: We are working on adding support for input signals.

