import { $, component$,  Slot, useSignal, useVisibleTask$, useStyles$, useContextProvider, useId, useContext, createContextId } from "@builder.io/qwik";
import type { QwikKeyboardEvent } from "@builder.io/qwik";
import type { FieldProps } from "../field";
import { FieldContext } from "../field";
import type { SelectionItemProps } from '../selection-list/types';
import type { FieldsetAttributes, UlAttributes } from "../types";
import { nextFocus, previousFocus, removeActive, useOnReset } from "../../utils";
import styles from './button-toggle.scss?inline';
import clsq from "~/components/utils/clsq";
import { moveActive } from "../../utils";

export interface CheckgroupProps extends FieldProps, Omit<FieldsetAttributes, 'role' | 'tabIndex' | 'onKeyDown$'> {}

const disabledKeys = ['Enter', ' ', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'];

const ButtonToggleGroupContext = createContextId<{ multi: boolean }>('ButtonToggleGroupContext');

interface ButtonToggleGroupProps extends UlAttributes {
  name?: string;
  multi?: boolean;
}

export const ButtonToggleGroup = component$((props: ButtonToggleGroupProps) => {
  useStyles$(styles);
  const root = useSignal<HTMLElement>();
  const active = useSignal('');
  const id = useId();
  const nameId = props.name ?? id;
  const multi = props.multi ?? false;

  useContextProvider(ButtonToggleGroupContext, { multi });

  // Update UI on resize
  useVisibleTask$(() => {
    const obs = new ResizeObserver(([entry]) => {
      if (!active.value) return;
      const input = document.getElementById(active.value);
      if (input) moveActive(entry.target as HTMLElement, input);
    });
    obs.observe(root.value!);
    return () => obs.disconnect();
  });
  
  // Prevent default on keydown
  useVisibleTask$(() => {
    const handler = (event: KeyboardEvent) => {
      if (disabledKeys.includes(event.key)) event.preventDefault();
    }
    root.value?.addEventListener('keydown', handler);
    return () => root.value?.removeEventListener('keydown', handler);
  });

  // Update on active element
  useVisibleTask$(({ track }) => {
    track(() => active.value);
    if (!root.value || multi) return;
    if (!active.value) return removeActive(root.value);
    const input = document.getElementById(active.value) as HTMLInputElement;
    moveActive(root.value, input);
    // Uncheck other (works only because changing check don't trigger onChange)
    const selector = `input:checked:not(#${active.value})`;
    const checked = root.value.querySelectorAll<HTMLInputElement>(selector);
    for (const el of checked) el.checked = false;
  });

  // Remove active on reset
  useOnReset(root, $(() => removeActive(root.value!)));

  const onKeyDown$ = $((event: QwikKeyboardEvent<HTMLInputElement>) => {
    const key = event.key;
    if (key === 'ArrowDown' || key === 'ArrowRight') {
      nextFocus(root.value?.querySelectorAll<HTMLElement>('input'));
    }
    if (key === 'ArrowUp' || key === 'ArrowLeft') {
      previousFocus(root.value?.querySelectorAll<HTMLElement>('input'));
    }
    if (event.target instanceof HTMLInputElement) {
      const radio = event.target;
      // Use click instead of setting checked to trigger onChange event
      if (key === 'Enter' || key === ' ') radio.click();
    }
  });

  useContextProvider(FieldContext, {
    name: nameId,
    change: $((event: any, input: HTMLInputElement) => {
      if (multi) return;
      active.value = input.checked ? input.id : '';
    }),
  });

  return <ul ref={root} role="list"
    class={clsq('button-toggle-group', multi ? 'multi' : 'single', props.class)}
    onKeyDown$={onKeyDown$}
  >
    <Slot />
  </ul>

})


export const ButtonToggleItem = component$((props: SelectionItemProps) => {
  const id = useId();
  const { name, change } = useContext(FieldContext);
  const { multi } = useContext(ButtonToggleGroupContext);
  const type = multi ? 'checkbox' : 'radio';

  return  <li {...props}>
    <input id={id} type={type} name={name} value={props.value} onChange$={change}/>
    <label for={id}>
      <Slot/>
    </label>
  </li>
})