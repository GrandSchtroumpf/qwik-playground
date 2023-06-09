import { $, component$,  Slot, useSignal, useVisibleTask$, useStyles$, useId, useContext } from "@builder.io/qwik";
import type { QwikKeyboardEvent} from "@builder.io/qwik";
import { FieldContext, useField,  } from "../field";
import type { FieldProps } from "../field";
import type { SelectionGroupProps, SelectionItemProps } from '../selection-list/selection-list';
import type { FieldsetAttributes, UlAttributes } from "../types";
import { nextFocus, previousFocus } from "../../utils";
import styles from './button-toggle.scss?inline';

export interface CheckgroupProps extends FieldProps, Omit<FieldsetAttributes, 'role' | 'tabIndex' | 'onKeyDown$'> {}

const disabledKeys = ['Enter', ' ', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'];

export const ButtonToggleGroup = component$((props: SelectionGroupProps) => {
  useStyles$(styles);
  useField(props);
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
  return <fieldset {...props} ref={root} class="button-toggle-group" onKeyDown$={onKeyDown$}>
    <Slot />
  </fieldset>
})


export const ButtonToggleList = component$((props: UlAttributes) => {
  useStyles$(styles);
  return <ul {...props}>
    <Slot />
  </ul>
});

export const ButtonToggleItem = component$((props: SelectionItemProps) => {
  useStyles$(styles);
  const id = useId();
  const { name } = useContext(FieldContext);
  
  return <li>
    <input id={id} type="radio" {...props} name={name} value={props.value} />
    <label for={id}>
      <Slot/>
    </label>
  </li>
})