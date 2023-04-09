import { $, component$, Slot, useComputed$, useStylesScoped$ } from "@builder.io/qwik";
import { usePopover, Popover } from "../../dialog/popover";
import { Listbox, useListbox } from "../listbox/listbox";
import { useField, useFieldClass } from "../field";
import styles from './select.scss?inline';
import type { QwikKeyboardEvent} from "@builder.io/qwik";
import type { FieldProps } from "../field";
import type { DisplayProps } from "../types";
import { toString } from "../utils";

export { Option } from '../listbox/listbox';



interface SelectProps<T = any> extends FieldProps<T>, DisplayProps<T> {}



export const Select = component$((props: SelectProps) => {
  useStylesScoped$(styles);
  // Contexts
  const { state: popover, open, close } = usePopover();
  const { state: listboxState, next, previous, toggle } = useListbox({ multiple: false });
  const fieldState = useField(props);
  const classes = useFieldClass(fieldState, 'field');
  
  // Listeners
  const display$ = props.display$ ?? toString;
  const displayValue = useComputed$(() => display$(fieldState.value));
  // TODO: add onChange$

  // Methods
  const onKeyDown$ = $((event: QwikKeyboardEvent<HTMLElement>, el: HTMLElement) => {
    const key = event.key;
    if (!popover.opened) {
      if (key === 'Enter' || key === ' ') open(el);
    } else {
      if (key === 'ArrowDown') next();
      if (key === 'ArrowUp') previous();
      if (key === 'Enter' || key === ' ') toggle(listboxState.active!);
    }
  });


  const onBlur$ = $(() => {
    close();
    fieldState.focused = false;
  });


  return <>
    <button class={classes} type="button"
      onClick$={(_, el) => popover.opened ? close() : open(el)}
      onFocus$={() => fieldState.focused = true}
      onBlur$={onBlur$}
      onKeyDown$={onKeyDown$}
    >
      {displayValue}
      <svg class={popover.opened ? 'opened' : 'closed'} viewBox="7 10 10 5" focusable="false">
        <polygon stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10"></polygon>
      </svg>
    </button>
    <Popover>
      <Listbox>
        <Slot />
      </Listbox>
    </Popover>
  </>
})