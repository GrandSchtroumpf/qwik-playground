import type { QwikJSX } from "@builder.io/qwik";
import { $, component$, Slot, useComputed$, useSignal, useStylesScoped$ } from "@builder.io/qwik";
import type { FieldProps} from "../field";
import { useFieldClass, useField } from "../field";
import styles from './input.scss?inline';

type InputAttributes = Omit<QwikJSX.IntrinsicElements['input'], 'children' | 'value'>;
interface InputProps extends InputAttributes, FieldProps {
  appearance?: 'standard' | 'stack';
}

export const Input = component$((props: InputProps) => {
  useStylesScoped$(styles);
  const input = useSignal<HTMLInputElement>();
  const { appearance, ...inputProps } = props;
  const fieldState = useField(props);
  const classes = useFieldClass(fieldState, appearance ?? 'standard');
  const type = inputProps.type;

  const getValue$ = $(() => {
    if (type === 'datetime-local') {
      return input.value?.valueAsDate ?? input.value?.value;
    } else if (type === 'number') {
      return input.value?.valueAsNumber ?? input.value?.value;
    } else {
      return input.value?.value;
    }
  });

  const onFocus$ = $(() => {
    fieldState.focused = true;
  });
  const onInput$ = $(() => {
    fieldState.dirty = true;
  });
  const onBlur$ = $(async () => {
    fieldState.focused = false;
    fieldState.touched = true;
    fieldState.value = await getValue$();
  });

  // TODO: Do not update at each change
  const inputValue = useComputed$(() => {
    if (fieldState.value instanceof Date) return fieldState.value.toDateString();
    return fieldState.value as string;
  });

  const field = { onFocus$, onBlur$, onInput$ };

  return <label class={classes}>
    <span class="label-text">
      <Slot />
    </span>
    <div class="field">
      <Slot name="prefix"/>
      <input ref={input} {...inputProps} {...field} bind:value={inputValue}/>
      <Slot name="suffix"/>
    </div>
  </label>
})