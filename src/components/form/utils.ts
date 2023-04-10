import { $, useVisibleTask$, noSerialize } from '@builder.io/qwik';
import type { Signal} from '@builder.io/qwik';

/** Transform any value into a default string */
export const toString = $(async (value: any): Promise<string> => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'bigint') return value.toString();
  if (Array.isArray(value)) return Promise.all(value.map(toString)).then(v => v.join());
  if (value instanceof Date) return value.toISOString();
  if ('toString' in value) return value.toString();
  return JSON.stringify(value);
});


/** Prevent default keydown */
export const useSyncEvent = <K extends keyof GlobalEventHandlersEventMap>(
  ref: Signal<HTMLElement | undefined>,
  eventName: K,
  cb: (event: GlobalEventHandlersEventMap[K]) => void
) => {
  const handler = noSerialize(cb);
  useVisibleTask$(() => {
    ref.value?.addEventListener(eventName, handler as any);
    return () => ref.value?.removeEventListener(eventName, handler as any);
  });
}

export const nextFocus = $((list?: NodeListOf<HTMLElement>) => {
  if (!list) return;
  const focusedEl = document.activeElement as HTMLElement;
  if (!focusedEl) return list[0]?.focus();
  const index = Array.from(list).indexOf(focusedEl);
  const nextIndex = (index + 1) % list.length;
  list[nextIndex].focus();
});
export const previousFocus = $((list?: NodeListOf<HTMLElement>) => {
  if (!list) return;
  const focusedEl = document.activeElement as HTMLElement;
  if (!focusedEl) return list[list.length - 1]?.focus();
  const index = Array.from(list).indexOf(focusedEl);
  const nextIndex = (index - 1 + list.length) % list.length;
  list[nextIndex].focus();
});
