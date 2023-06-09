import { Slot, component$, useStyles$ } from "@builder.io/qwik";
import type { InputAttributes } from "../types";
import styles from './switch.scss?inline';

export type SwitchProps = Omit<InputAttributes, 'type' | 'role' | 'children'>;

export const Switch = component$((props: SwitchProps) => {
  useStyles$(styles);
  return <label class="switch">
    <input type="checkbox" role="switch" {...props} />
    <div class="track">
      <span class="thumb"></span>
    </div>
    <Slot />
  </label>
})