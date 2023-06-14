import { component$, Slot, useId, useStyles$ } from "@builder.io/qwik";
import type { FieldProps } from '../field';
import type { FieldsetAttributes, InputAttributes, UlAttributes } from "../../types";
import styles from './radio.scss?inline';
import clsq from "~/components/utils/clsq";

export interface RadioGroupProps extends FieldProps, Omit<FieldsetAttributes, 'role' | 'tabIndex' | 'onKeyDown$'> {}

export const RadioGroup = component$((props: RadioGroupProps) => {
  return <fieldset {...props} class={clsq("radio-group", props.class)}>
    <Slot />
  </fieldset>
});

export const RadioList = component$((props: UlAttributes) => {
  return <ul {...props} class={clsq("radio-list", props.class)}>
    <Slot />
  </ul>
});

type RadioItemProps = Omit<InputAttributes, 'type' | 'children'>;
export const RadioItem = component$((props: RadioItemProps) => {
  useStyles$(styles);
  const id = useId();
  
  return <li class="radio-item">
    <input id={id} type="radio" {...props} value={props.value} />
    <label for={id}>
      <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
        <circle r="8" cx="12" cy="12"/>
      </svg>
      <Slot/>
    </label>
  </li>
});