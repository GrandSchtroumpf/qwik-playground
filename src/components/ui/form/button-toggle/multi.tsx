import { $, component$,  Slot, useContext, useId, useStyles$ } from "@builder.io/qwik";
import { useMultiSelectionList, MultiSelectionListContext } from '../selection-list/multi-selection-list';
import { FieldContext, useField } from "../field";
import type { FieldProps } from "../field";
import type { MultiSelectionGroupProps, MultiSelectionItemProps } from '../selection-list/multi-selection-list';
import type { FieldsetAttributes, UlAttributes } from "../types";
import styles from './button-toggle.scss?inline';
import { useKeyboard } from "~/components/utils";

export interface CheckgroupProps extends FieldProps, Omit<FieldsetAttributes, 'role' | 'tabIndex' | 'onKeyDown$'> {}

const preventKeys = ['Enter', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'ctrl+a'];
export const MultiButtonToggleGroup = component$((props: MultiSelectionGroupProps) => {
  useStyles$(styles);
  useField(props);
  const { listRef, toggleAll, next, previous } = useMultiSelectionList(props);
  useKeyboard(listRef, preventKeys, $((event) => {
    if (event.ctrlKey && event.key === 'a') toggleAll();
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next();
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') previous();
    if (event.key === 'Enter' && document.activeElement instanceof HTMLInputElement) {
      document.activeElement.checked = !document.activeElement.checked;
    }
  }));
  // // Prevent default behavior
  // useVisibleTask$(() => {
  //   const handler = (event: KeyboardEvent) => {
  //     if (disabledKeys.includes(event.key)) event.preventDefault();
  //   }
  //   root.value?.addEventListener('keydown', handler);
  //   return () => root.value?.removeEventListener('keydown', handler);
  // });

  // // Create new behavior
  // const onKeyDown$ = $((event: QwikKeyboardEvent<HTMLInputElement>) => {
  //   const key = event.key;
  //   if (event.ctrlKey && key === 'a') toggleAll();
  //   if (key === 'ArrowDown' || key === 'ArrowRight') next();
  //   if (key === 'ArrowUp' || key === 'ArrowLeft') previous();
  //   if (event.target instanceof HTMLInputElement) {
  //     const radio = event.target;
  //     if (key === 'Enter') radio.checked = !radio.checked;
  //   }
  // });

  return <fieldset ref={listRef} class="button-toggle-group">
    <Slot />
  </fieldset>
})


export const MultiButtonToggleList = component$((props: UlAttributes) => {
  useStyles$(styles);
  return <ul {...props}>
    <Slot />
  </ul>
})

export const MultiButtonToggleItem = component$((props: MultiSelectionItemProps) => {
  useStyles$(styles);
  const { updateMode } = useContext(MultiSelectionListContext);
  const id = useId();
  const { name } = useContext(FieldContext);
  
  return <li>
    <input id={id} type="checkbox" {...props} name={name} value={props.value} onChange$={updateMode}/>
    <label for={id}>
      <Slot/>
    </label>
  </li>
})