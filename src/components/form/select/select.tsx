import { component$, Slot, useComputed$, useStylesScoped$, useSignal, event$, useId } from "@builder.io/qwik";
import { usePopover, Popover } from "../../dialog/popover";
import { useField } from "../field";
import styles from './select.scss?inline';
import type { QwikKeyboardEvent } from "@builder.io/qwik";
import type { FieldProps } from "../field";
import type { DisplayProps } from "../types";
import { toString } from "../utils";
import { Listbox } from "../listbox/listbox";


interface SelectProps<T = any> extends FieldProps<T>, DisplayProps<T> {
  multiple?: boolean;
  placeholder?: string;
}


export const Select = component$((props: SelectProps) => {
  useStylesScoped$(styles);
  const listboxId = useId();
  const root = useSignal<HTMLElement>();
  const controller = useSignal<HTMLElement>();
  const multiple = props.multiple ?? false;

  // Contexts
  const { state: popover, open, close } = usePopover();
  const fieldState = useField({
    ...props,
    value: props.value || (multiple ? [] : ''),
  });
  
  // Listeners
  const display$ = props.display$ ?? toString;
  const displayValue = useComputed$(() => display$(fieldState.value) as any);

  
  const onClick$ = event$(() => {
    if (popover.opened && !multiple) close();
    if (!popover.opened) open(root.value!);
  });
  
  const onKeyDown$ = event$((event: QwikKeyboardEvent<HTMLElement>) => {
    const el = root.value!;
    if (!popover.opened) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) open(el);
    }
  });

  const onSelected$ = event$((value: string | string[]) => {
    fieldState.value = value;
    if (!multiple) close();
  });

  return <div ref={root} class="field" >
    <button ref={controller} type="button"
      role="combobox"
      onBlur$={() => close()}
      onClick$={onClick$}
      onKeyDown$={onKeyDown$}
      aria-haspopup="listbox" 
      aria-disabled="false"
      aria-invalid="false"
      aria-autocomplete="none"
      aria-expanded={popover.opened}
      aria-controls={listboxId}
      >
        {displayValue}
      <svg class={popover.opened ? 'opened' : 'closed'} aria-owns={listboxId} viewBox="7 10 10 5" focusable="false">
        <polygon stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10"></polygon>
      </svg>
    </button>
    <input name={props.name} value={fieldState.value} hidden/>
    <Popover>
      <Listbox id={listboxId} controller={controller} multiple={multiple} onSelected$={onSelected$}>
        <Slot />
      </Listbox>
    </Popover>
  </div>
});


