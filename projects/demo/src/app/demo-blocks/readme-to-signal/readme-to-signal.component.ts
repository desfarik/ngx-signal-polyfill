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
