import { ChangeDetectorRef, inject, Injector, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Signal } from '../signals';
import { toObservable } from '../rxjs-interop';

@Pipe({
  name: 'signal',
  pure: false
})
export class SignalPipe implements PipeTransform, OnDestroy {
  ngOnDestroy(): void {
    this.asyncPipe.ngOnDestroy();
  }

  asyncPipe: AsyncPipe;

  constructor(changeDetectorRef: ChangeDetectorRef) {
    this.asyncPipe = new AsyncPipe(changeDetectorRef);
  }

  observable!: Observable<any>;
  latestSignal!: Signal<any>;

  transform<T>(signal: Signal<T>): T {
    if (signal !== this.latestSignal) {
      this.observable = toObservable(signal);
      this.latestSignal = signal;
    }
    return this.asyncPipe.transform<T>(this.observable) || signal();
  }
}
