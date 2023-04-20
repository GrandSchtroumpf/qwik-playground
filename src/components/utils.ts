import { useVisibleTask$, $ } from "@builder.io/qwik";
import type { QRL, Signal } from "@builder.io/qwik";

export function useKeyboard(
  ref: Signal<HTMLElement | undefined>,
  keys: string[],
  cb: QRL<(event: KeyboardEvent, element: HTMLElement) => any>,
) {
  useVisibleTask$(() => {
    const handler = (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
        event.preventDefault();
        cb(event, ref.value!)
      }
    }
    ref.value?.addEventListener('keydown', handler);
    return () => ref.value?.removeEventListener('keydown', handler);
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
