import { $, component$,  Slot, useStyles$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { SelectionItem, SelectionList, SelectionGroup } from '../selection-list/selection-list';
import type { QwikKeyboardEvent} from "@builder.io/qwik";
import type { FieldProps } from "../field";
import type { SelectionGroupProps, SelectionItemProps } from '../selection-list/selection-list';
import type { FieldsetAttributes } from "../types";
import styles from './button-toggle.scss?inline';
import { nextFocus, previousFocus } from "../../utils";

export interface CheckgroupProps extends FieldProps, Omit<FieldsetAttributes, 'role' | 'tabIndex' | 'onKeyDown$'> {}

const disabledKeys = ['Enter', ' ', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'];

export const ButtonToggleGroup = component$((props: SelectionGroupProps) => {
  useStyles$(styles);
  const root = useSignal<HTMLElement>();
  useVisibleTask$(() => {
    const handler = (event: KeyboardEvent) => {
      if (disabledKeys.includes(event.key)) event.preventDefault();
    }
    root.value?.addEventListener('keydown', handler);
    return () => root.value?.removeEventListener('keydown', handler);
  });

  const onKeyDown$ = $((event: QwikKeyboardEvent<HTMLInputElement>) => {
    const key = event.key;
    if (key === 'ArrowDown' || key === 'ArrowRight') {
      nextFocus(root.value?.querySelectorAll('input[type="radio"]'));
    }
    if (key === 'ArrowUp' || key === 'ArrowLeft') {
      previousFocus(root.value?.querySelectorAll('input[type="radio"]'));
    }
    if (event.target instanceof HTMLInputElement) {
      const radio = event.target;
      if (key === 'Enter' || key === ' ') radio.checked = !radio.checked;
    }
  });
  return <SelectionGroup {...props} ref={root} class="button-toggle-group" onKeyDown$={onKeyDown$}>
    <Slot />
  </SelectionGroup>
})


export const ButtonToggleList = component$(() => {
  useStyles$(styles);
  return <SelectionList>
    <Slot />
  </SelectionList>
});

export const ButtonToggleItem = component$((props: SelectionItemProps) => {
  return <SelectionItem {...props} >
    <Slot />
  </SelectionItem>
})