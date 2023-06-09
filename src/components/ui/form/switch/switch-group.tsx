import { Slot, component$, useStyles$, useSignal, $ } from "@builder.io/qwik";
import { Switch } from "./switch";
import { nextFocus, previousFocus, useKeyboard } from "../../utils";
import type { FieldsetAttributes, UlAttributes } from "../types";
import type { SwitchProps } from "./switch";
import styles from './switch.scss?inline';

const preventKeys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'ctrl+a'];

export const SwitchGroup = component$((props: FieldsetAttributes) => {
  useStyles$(styles);
  const ref = useSignal<HTMLElement>();
  const toggleAll = $(() => {
    if (!ref.value) return;
    const checkboxes = ref.value.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    let amount = 0;
    for (const checkbox of checkboxes) {
      if (checkbox.checked) amount++;
    }
    const shouldCheckAll = amount !== checkboxes.length;
    for (const checkbox of checkboxes) checkbox.checked = shouldCheckAll;
  });
  useKeyboard(ref, preventKeys, $((event) => {
    const list = ref.value?.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLElement>;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextFocus(list);
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') previousFocus(list);
    if (event.ctrlKey && event.key === 'a') toggleAll();
  }));
  return <fieldset class="switch-group" {...props} ref={ref}>
    <Slot/>
  </fieldset>
});

export const SwitchList = component$((props: UlAttributes) => {
  useStyles$(styles);
  return <ul class="switch-list" {...props}>
    <Slot/>
  </ul>
});

export const SwitchItem = component$((props: SwitchProps) => {
  useStyles$(styles);
  return <li class="switch-item">
    <Switch {...props}>
      <Slot/>
    </Switch>
  </li>
});