import { useVisibleTask$, $, createContextId } from "@builder.io/qwik";
import type { QRL, Signal } from "@builder.io/qwik";


export const StyleScopeContext = createContextId<{ scopeId: string }>('StyleScopeContext');

export function useKeyboard(
  ref: Signal<HTMLElement | undefined>,
  keys: string[],
  cb: QRL<(event: KeyboardEvent, element: HTMLElement) => any>,
) {
  useVisibleTask$(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        if (keys.includes(`ctrl+${event.key}`)) {
          event.preventDefault();
          cb(event, ref.value!);
        }
      } else if (keys.includes(event.key)) {
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


interface Point {
  x: number;
  y: number;
}
export function relativePosition(root: Point, target: Point): Point {
  return {
    x: target.x - root.x,
    y: target.y - root.y,
  }
}