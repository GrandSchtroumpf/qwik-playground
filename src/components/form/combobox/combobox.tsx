import { component$, Slot, useComputed$, useStylesScoped$, useSignal, event$, useId } from "@builder.io/qwik";
import { usePopover, Popover } from "../../dialog/popover";
import { useField } from "../field";
import type { QwikKeyboardEvent, QRL } from "@builder.io/qwik";
import type { FieldProps } from "../field";
import type { DisplayProps } from "../types";
import { toString } from "../utils";
import { Listbox } from "../listbox/listbox";
import styles from './combobox.scss?inline';


interface ComboboxProps<T = any> extends FieldProps<T>, DisplayProps<T> {
  onSearch$: QRL<(value: string) => any>
  multiple?: boolean;
  placeholder?: string;
}


export const Combobox = component$((props: ComboboxProps) => {
  useStylesScoped$(styles);
  const listboxId = useId();
  const root = useSignal<HTMLElement>();
  const controller = useSignal<HTMLElement>();
  const onSearch$ = props.onSearch$;
  const multiple = props.multiple ?? false;

  // Contexts
  const { state: popover, toggle, close, open } = usePopover();
  const fieldState = useField({
    ...props,
    value: props.value || (multiple ? [] : ''),
  });
  
  // Listeners
  const display$ = props.display$ ?? toString;
  const displayValue = useComputed$(() => display$(fieldState.value) as any);
  
  const onKeyDown$ = event$((event: QwikKeyboardEvent<HTMLElement>) => {
    if (!popover.opened) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) open(root.value!);
    }
  });


  return <div class="field" ref={root}>
    <input ref={controller}
      value={displayValue.value}
      role="combobox"
      onKeyDown$={onKeyDown$}
      onFocus$={() => toggle(root.value!)}
      onBlur$={() => close()}
      onInput$={(_, el) => onSearch$(el.value)}
      aria-haspopup="listbox" 
      aria-disabled="false"
      aria-invalid="false"
      aria-autocomplete="list"
      aria-expanded={popover.opened}
      aria-controls={listboxId}
    />
    <Popover>
      <Listbox id={listboxId} controller={controller} onSelected$={(v) => fieldState.value = v}>
        <Slot />
      </Listbox>
    </Popover>

  </div>
});