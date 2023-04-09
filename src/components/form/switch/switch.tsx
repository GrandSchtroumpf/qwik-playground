import { Slot, component$, useStylesScoped$ } from "@builder.io/qwik";
import type { InputAttributes } from "../types";
import styles from './switch.scss?inline';

export type SwitchProps = Omit<InputAttributes, 'type' | 'role' | 'children'>;

export const Switch = component$((props: SwitchProps) => {
  useStylesScoped$(styles);
  return <label>
    <input type="checkbox" role="switch" {...props} />
    <div class="track">
      <span class="thumb"></span>
    </div>
    <Slot />
  </label>
})