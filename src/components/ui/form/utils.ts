import { $, useVisibleTask$, noSerialize } from '@builder.io/qwik';
import type { Signal, QRL } from '@builder.io/qwik';

export const exist = <T>(v?: T | null): v is T => !!v;

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



export function useOnElement<K extends keyof GlobalEventHandlersEventMap>(
  ref: Signal<HTMLElement | undefined>,
  eventName: K,
  eventQrl: QRL<(event: GlobalEventHandlersEventMap[K]) => void>
) {
  useVisibleTask$(() => {
    ref.value?.addEventListener(eventName, eventQrl);
    return () => ref.value?.removeEventListener(eventName, eventQrl);
  });
}


export function getFormValue<T>(form: HTMLFormElement) {
  const data = new FormData(form);
  const result: Record<string, any> = {};
  for (const [key, value] of data.entries()) {
    result[key] = value;
  }
  return result as T;
}