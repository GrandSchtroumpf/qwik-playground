import { $, component$,  Slot, useContext, useSignal, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import { MultiSelectionItem, MultiSelectionList, useMultiSelectionList, MultiSelectionGroup, MultiSelectionListContext } from '../selection-list/multi-selection-list';
import type { QwikKeyboardEvent} from "@builder.io/qwik";
import type { FieldProps } from "../field";
import type { MultiSelectionGroupProps, MultiSelectionItemProps } from '../selection-list/multi-selection-list';
import type { FieldsetAttributes } from "../types";
import styles from './button-toggle.scss?inline';

export interface CheckgroupProps extends FieldProps, Omit<FieldsetAttributes, 'role' | 'tabIndex' | 'onKeyDown$'> {}

const disabledKeys = ['Enter', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'];
export const MultiButtonToggleGroup = component$((props: MultiSelectionGroupProps) => {
  useStyles$(styles);
  const root = useSignal<HTMLElement>();
  const { toggleAll, next, previous } = useMultiSelectionList(props);
  
  // Prevent default behavior
  useVisibleTask$(() => {
    const handler = (event: KeyboardEvent) => {
      if (disabledKeys.includes(event.key)) event.preventDefault();
    }
    root.value?.addEventListener('keydown', handler);
    return () => root.value?.removeEventListener('keydown', handler);
  });

  // Create new behavior
  const onKeyDown$ = $((event: QwikKeyboardEvent<HTMLInputElement>) => {
    const key = event.key;
    if (event.ctrlKey && key === 'a') toggleAll();
    if (key === 'ArrowDown' || key === 'ArrowRight') next();
    if (key === 'ArrowUp' || key === 'ArrowLeft') previous();
    if (event.target instanceof HTMLInputElement) {
      const radio = event.target;
      if (key === 'Enter') radio.checked = !radio.checked;
    }
  });

  return <MultiSelectionGroup ref={root} class="button-toggle-group" onKeyDown$={onKeyDown$}>
    <Slot />
  </MultiSelectionGroup>
})


export const MultiButtonToggleList = component$(() => {
  useStyles$(styles);
  return <MultiSelectionList>
    <Slot />
  </MultiSelectionList>
})

export const MultiButtonToggleItem = component$((props: MultiSelectionItemProps) => {
  const { updateMode } = useContext(MultiSelectionListContext);
  return <MultiSelectionItem {...props} onChange$={updateMode}>
    <Slot />
  </MultiSelectionItem>
})