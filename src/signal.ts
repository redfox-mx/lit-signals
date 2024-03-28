/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { createSignal, SIGNAL, SignalGetter, signalSetFn, signalUpdateFn } from "@angular/core/primitives/signals";

/**
 * A reactive value which notifies consumers of any changes.
 *
 * Signals are functions which returns their current value. To access the current value of a signal,
 * call it.
 *
 * Ordinary values can be turned into `Signal`s with the `signal` function.
 */
export type Signal<T> = (() => T) & {
  [SIGNAL]: unknown;
};

/**
 * Checks if the given `value` is a reactive `Signal`.
 */
export function isSignal(value: unknown): value is Signal<unknown> {
  return (
    typeof value === "function" &&
    (value as Signal<unknown>)[SIGNAL] !== undefined
  );
}

/**
 * A `Signal` with a value that can be mutated via a setter interface.
 */
export interface WritableSignal<T> extends Signal<T> {
  /**
   * Directly set the signal to a new value, and notify any dependents.
   */
  set(value: T): void;

  /**
   * Update the value of the signal based on its current value, and
   * notify any dependents.
   */
  update(updateFn: (value: T) => T): void;

  /**
   * Returns a readonly version of this signal. Readonly signals can be accessed to read their value
   * but can't be changed using set or update methods. The readonly signals do _not_ have
   * any built-in mechanism that would prevent deep-mutation of their value.
   */
}

export function signal<T>(initialValue: T): WritableSignal<T> {
    const signalFn = createSignal(initialValue) as SignalGetter<T> & WritableSignal<T>;
    const node = signalFn[SIGNAL];
    signalFn.set = (newValue: T) => signalSetFn(node, newValue);
    signalFn.update = (updateFn: (value: T) => T) => signalUpdateFn(node, updateFn);
    return signalFn as WritableSignal<T>;
};
