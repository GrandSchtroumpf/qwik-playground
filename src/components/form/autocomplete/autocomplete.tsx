import { $, Slot, component$, useStylesScoped$, useComputed$, useSignal, useVisibleTask$, useId } from "@builder.io/qwik";
import type { QwikKeyboardEvent, QRL } from "@builder.io/qwik";
import type { FieldProps } from "../field";
import type { DisplayProps } from "../types";
import { Popover, usePopover } from "../../dialog/popover";
import { useField, useFieldClass } from "../field";
import { useListbox, Listbox } from "../listbox/listbox";
import { toString } from "../utils";
import styles from './autocomplete.scss?inline';

interface AutocompleteProps<T = any> extends FieldProps<T>, DisplayProps<T> {
  onSearch$: QRL<(value: string) => void>
}


export const Autocomplete = component$((props: AutocompleteProps) => {
  useStylesScoped$(styles);
  const listboxId = useId();
  const input = useSignal<HTMLInputElement>();
  const origin = useSignal<HTMLElement>();
  // Contexts
  const { state: popoverState, open, close } = usePopover();
  const { state: listboxState, next, previous, toggle } = useListbox({ multiple: false });
  const fieldState = useField(props);
  const classes = useFieldClass(fieldState, 'standard');


  // Listeners
  useVisibleTask$(() => {
    const keys = ['Enter', 'ArrowDown', 'ArrowUp']
    const handler = (event: KeyboardEvent) => {
      if (keys.includes(event.key)) event.preventDefault();
    };
    input.value?.addEventListener('keydown', handler);
    return () => input.value?.removeEventListener('keydown', handler);
  });
  const display$ = props.display$ ?? toString;
  const displayValue = useComputed$(() => display$(fieldState.value) as any);
  // TODO: add onChange$
  
  // Methods
  const onKeyDown$ = $((event: QwikKeyboardEvent<HTMLElement>, el: HTMLElement) => {
    const key = event.key;
    if (!popoverState.opened) {
      if (key === 'Enter' || key === ' ') open(el);
    } else {
      if (key === 'ArrowDown') next();
      if (key === 'ArrowUp') previous();
      if (key === 'Enter' || key === ' ') toggle(listboxState.active!);
    }
  });
  const onFocus$ = $(() => {
    if (origin.value) open(origin.value);
    fieldState.focused = true;
  });
  const onBlur$ = $(() => {
    close();
    fieldState.focused = false;
  });

  return <>
  <label class={classes} ref={origin}>
    <span class="label-text"></span>
    <div class="field">
      <input ref={input}
        type="search"
        role="combobox" // Default aria-haspopup="listbox"
        aria-autocomplete="list"
        aria-expanded={popoverState.opened}
        aria-invalid={!fieldState.invalid}
        aria-activedescendant={listboxState.active ?? undefined}
        aria-controls={listboxId}
        disabled={fieldState.disabled}
        required={props.required}
        onKeyDown$={onKeyDown$}
        onFocus$={onFocus$}
        onBlur$={onBlur$}
        onInput$={(_, element) => props.onSearch$(element.value)}
        value={displayValue.value}
      />
    </div>
  </label>
  <Popover>
    <Listbox id={listboxId}>
      <Slot />
    </Listbox>
  </Popover>
</>
})