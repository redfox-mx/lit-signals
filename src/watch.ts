import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { Watch, createWatch } from '@angular/core/primitives/signals';
import { Signal } from './signal'
import { untracked } from './untracked'

class WatchDirective extends AsyncDirective {

  private __signal?: Signal<unknown>;
  private __watcher?: Watch;

  private dispose(){
    this.__watcher?.destroy();
    this.__watcher = undefined;
  }

  schedule() {
    queueMicrotask(() => {
      this.__watcher?.run()
    })
  }

  override render(signal: Signal<unknown>) {
    if(signal !== this.__signal) {
      this.dispose();
      this.__signal = signal;
      let updateFromLit = true;
      this.__watcher = createWatch(
        () => {
          const value = signal();
          if(updateFromLit === false) {
            this.setValue(value)
          }
        },
        () => this.schedule(),
        false
      )
      this.__watcher.run();
      updateFromLit = false;
    }
    return untracked(signal)
  }

  protected override disconnected(): void {
    this.dispose();
  }

  protected override reconnected(): void {
    this.__watcher = createWatch(
      () => {
        const value = this.__signal?.();
        this.setValue(value);
      },
      () => this.schedule(),
      false
    )

    // Now we notify for run watch callback and update value
    this.__watcher.notify();
  }

}

export const watch = directive(WatchDirective);