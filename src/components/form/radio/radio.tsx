import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import { SelectionGroup, SelectionList, SelectionItem } from '../selection-list/selection-list';
import type { SelectionGroupProps, SelectionListProps, SelectionItemProps } from '../selection-list/selection-list';
import styles from './radio.scss?inline';

export const RadioGroup = component$((props: SelectionGroupProps) => {
  useStyles$(styles);
  return <SelectionGroup {...props} class="radio-group">
    <Slot />
  </SelectionGroup>
});

export const RadioList = component$((props: SelectionListProps) => {
  useStyles$(styles);
  return <SelectionList {...props}>
    <Slot />
  </SelectionList>
});

export const RadioItem = component$((props: Omit<SelectionItemProps, 'type'>) => {
  useStyles$(styles);
  return <SelectionItem {...props}>
    <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
      <circle r="8" cx="12" cy="12"/>
    </svg>
    <Slot/>
  </SelectionItem>
});