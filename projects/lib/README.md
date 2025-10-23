# ngx-signal-polyfill

signals for all Angular versions

## Overview

**ngx-signal-polyfill** — This library provides signals support to older versions of Angular. Improves developer experience with signals features and is easy to migrate to native Angular signals

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

signal:

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { signal } from 'ngx-signal-polyfill';

@Component({
  selector: 'app-readme-signal',
  template: `
    <p>Counter: {{ counter | signal }}</p>
    <div>
      <button (click)="increment()">increment</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadmeSignalComponent {
  counter = signal(0);

  increment() {
    this.counter.set(this.counter() + 1);
  }
}
```

computed:

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { computed, signal } from 'ngx-signal-polyfill';

@Component({
  selector: 'app-readme-computed',
  template: `
    <p>Counter: {{ counter | signal }}</p>
    <p>Computed x2: {{ counterX2 | signal }}</p>
    <div>
      <button (click)="increment()">increment</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadmeComputedComponent {
  counter = signal(0);
  counterX2 = computed(() => this.counter() * 2);

  increment() {
    this.counter.set(this.counter() + 1);
  }
}
```

effect:

```typescript
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { effect, signal } from 'ngx-signal-polyfill';

@Component({
  selector: 'app-readme-effect',
  template: `
    <p>Counter: {{ counter | signal }}</p>
    <div>
      <button (click)="increment()">increment</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadmeEffectComponent implements OnDestroy {
  counter = signal(0);

  effectRef = effect(() => {
    console.log(`effect: counter changed - ${this.counter()}`);
  });

  ngOnDestroy(): void {
    this.effectRef.destroy();
    console.log('effect: ref destroyed');
  }

  increment() {
    this.counter.set(this.counter() + 1);
  }
}
```

toObservable:

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { signal, toObservable } from 'ngx-signal-polyfill';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-readme-to-observable',
  template: `
    <p>Counter: {{ counter | signal }}</p>
    <p>Counter x2: {{ counterX2$ | async }}</p>
    <div>
      <button (click)="increment()">increment</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadmeToObservableComponent {
  counter = signal(0);

  counterX2$ = toObservable(this.counter)
    .pipe(map(x => x * 2));

  increment() {
    this.counter.set(this.counter() + 1);
  }
}
```

toSignal:

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { computed, Destroy$, toSignal } from 'ngx-signal-polyfill';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-readme-to-signal',
  template: `
    <p>Counter$: {{ counter$ | async }}</p>
    <p>Counter signal: {{ counter | signal }}</p>
    <p>Counter x2: {{ counterX2 | signal }}</p>
    <div>
      <button (click)="increment()">increment</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [Destroy$]
})
export class ReadmeToSignalComponent {
  counter$ = new BehaviorSubject(0);

  counter = toSignal(this.counter$.pipe(takeUntil(this.destroy$)), { manualCleanup: true, requireSync: true });
  counterX2 = computed(() => this.counter() * 2);

  increment() {
    this.counter$.next(this.counter$.value + 1);
  }

  constructor(private destroy$: Destroy$) {
  }
}

```

## API Compatibility

| Feature          | Angular Compatibility                      | Notes                                                  |
|------------------|--------------------------------------------|--------------------------------------------------------|
| **Primitives**   |                                            |                                                        |
| `computed`       | ✅ Fully supported                          | Just copied from @angular/core                         |
| `signal`         | ✅ Fully supported                          | Just copied from @angular/core                         |
| `effect`         | ⚠️ `manualCleanup: true` is always enabled | Copied and adopted to usage in older angular versions. |
| **RxJS Interop** |
| `toObservable`   | ⚠️ `manualCleanup: true` is always enabled | Copied and adopted to usage in older angular versions. |
| `toSignal`       | ⚠️ `manualCleanup: true` is always enabled | Copied and adopted to usage in older angular versions. |

## Don't Forget to Unsubscribe

In original Angular, if you use `effect`, `toObservable` or `toSignal` in an injection context, you don't need to unsubscribe from it. However, we cannot implement this  ~~automagic~~ **automatic** unsubscribe feature in our polyfill.

Therefore, you need to be careful and remember to manually unsubscribe from `effect`, `toObservable` or `toSignal`.

In this regard, I recommend using `toObservable` instead of `effect` because there are many tools available to make automatic RxJS unsubscription easier. Here are some useful tools:

- `Async | pipe`: Automatically handles unsubscription when the component is destroyed.
- [@ngneat/until-destroy](https://www.npmjs.com/package/@ngneat/until-destroy): A decorator that automatically unsubscribes from observables when the component is destroyed.
- `takeUntil(this.destroy$)`: `destroy$` will emits value when the component is destroyed.
- `takeUntil(notifier)`: Use any notifier to handle unsubscription.

## Future Plans

• Migration Tool: We plan to develop a migration tool to help you transition to Angular 16, allowing you to replace the polyfill with native signal support.

•  [Signal queries](https://angular.dev/guide/signals/queries) ViewChild and ViewChildren Support: Development is underway to support ViewChild and ViewChildren.

•  [Signal inputs](https://angular.dev/guide/signals/inputs) Signal inputs: Input Signal: We are working on adding support for input signals.

