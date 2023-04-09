import { Slot, component$, useStylesScoped$ } from "@builder.io/qwik";
import { Switch } from "./switch";
import type { FieldsetAttributes, UlAttributes } from "../types";
import type { SwitchProps } from "./switch";
import styles from './switch.scss?inline';

export const SwitchGroup = component$((props: FieldsetAttributes) => {
  useStylesScoped$(styles);
  return <fieldset {...props}>
    <Slot/>
  </fieldset>
});

export const SwitchList = component$((props: UlAttributes) => {
  useStylesScoped$(styles);
  return <ul {...props}>
    <Slot/>
  </ul>
});

export const SwitchItem = component$((props: SwitchProps) => {
  useStylesScoped$(styles);
  return <li>
    <Switch {...props}>
      <Slot/>
    </Switch>
  </li>
});