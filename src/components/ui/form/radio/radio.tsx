import { component$, Slot, useContext, useId, useStyles$ } from "@builder.io/qwik";
import { FieldContext } from "../field";
import type { FieldProps } from '../field';
import type { FieldsetAttributes, InputAttributes, UlAttributes } from "../../types";
import styles from './radio.scss?inline';

export interface RadioGroupProps extends FieldProps, Omit<FieldsetAttributes, 'role' | 'tabIndex' | 'onKeyDown$'> {}

export const RadioGroup = component$((props: RadioGroupProps) => {
  useStyles$(styles);
  return <fieldset class="radio-group" {...props}>
    <Slot />
  </fieldset>
});

export const RadioList = component$((props: UlAttributes) => {
  useStyles$(styles);
  return <ul class="radio-list" {...props}>
    <Slot />
  </ul>
});

type RadioItemProps = Omit<InputAttributes, 'type' | 'name' | 'tabIndex' | 'children'>;
export const RadioItem = component$((props: RadioItemProps) => {
  useStyles$(styles);
  const id = useId();
  const { name } = useContext(FieldContext);
  
  return <li class="radio-item">
    <input id={id} type="radio" {...props} name={name} value={props.value} />
    <label for={id}>
      <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
        <circle r="8" cx="12" cy="12"/>
      </svg>
      <Slot/>
    </label>
  </li>
});