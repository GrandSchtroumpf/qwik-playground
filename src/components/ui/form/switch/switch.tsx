import { Slot, component$, useStyles$ } from "@builder.io/qwik";
import { useRecordName } from "../field";
import type { InputAttributes } from "../types";
import styles from './switch.scss?inline';

export type SwitchProps = Omit<InputAttributes, 'type' | 'role' | 'children'>;

export const Switch = component$((props: SwitchProps) => {
  useStyles$(styles);
  const name = useRecordName(props);
  return <label class="switch">
    <input {...props} type="checkbox" role="switch" name={name} />
    <div class="track">
      <span class="thumb"></span>
    </div>
    <Slot />
  </label>
})