import { component$, Slot, useComputed$, useStylesScoped$, useSignal, event$, useId } from "@builder.io/qwik";
import { usePopover, Popover } from "../../dialog/popover";
import { useField } from "../field";
import type { QwikKeyboardEvent, Signal } from "@builder.io/qwik";
import type { FieldProps } from "../field";
import type { DisplayProps } from "../types";
import { toString } from "../utils";
import { Listbox } from "../listbox/listbox";
import styles from './combobox.scss?inline';


interface ComboboxProps<T = any> extends FieldProps<T>, DisplayProps<T> {
  search: Signal<string>;
  multiple?: boolean;
  placeholder?: string;
}


export const Combobox = component$((props: ComboboxProps) => {
  useStylesScoped$(styles);
  const listboxId = useId();
  const root = useSignal<HTMLElement>();
  const controller = useSignal<HTMLElement>();
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

  const onSelected$ = event$((value: string | string[]) => {
    fieldState.value = value;
    if (!multiple) close();
  });

  return <div class="field" ref={root}>
    <input ref={controller}
      value={displayValue.value}
      role="combobox"
      onKeyDown$={onKeyDown$}
      onFocus$={() => toggle(root.value!)}
      onBlur$={() => close()}
      onInput$={(_, el) => props.search.value = el.value}
      aria-haspopup="listbox" 
      aria-disabled="false"
      aria-invalid="false"
      aria-autocomplete="list"
      aria-expanded={popover.opened}
      aria-controls={listboxId}
    />
    <input name={fieldState.name} value={fieldState.value} hidden/>
    <Popover>
      <Listbox id={listboxId} controller={controller} onSelected$={onSelected$}>
        <Slot />
      </Listbox>
    </Popover>

  </div>
});