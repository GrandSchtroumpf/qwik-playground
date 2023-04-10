import { $, component$, Slot, useComputed$, useStylesScoped$, useSignal, event$, useVisibleTask$, useId } from "@builder.io/qwik";
import { usePopover, Popover } from "../../dialog/popover";
import { useField } from "../field";
import styles from './select.scss?inline';
import type { QwikKeyboardEvent, QwikMouseEvent, QwikFocusEvent } from "@builder.io/qwik";
import type { FieldProps } from "../field";
import type { DisplayProps } from "../types";
import { toString } from "../utils";
import { nextActive, previousActive, Listbox } from "../listbox/listbox";


interface SelectProps<T = any> extends FieldProps<T>, DisplayProps<T> {
  multiple?: boolean;
  placeholder?: string;
}


const preventKeys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Enter', ' '];
export const Select = component$((props: SelectProps) => {
  useStylesScoped$(styles);
  const listboxId = useId();
  const root = useSignal<HTMLElement>();
  const multiple = props.multiple ?? false;

  // Contexts
  const { state: popover, open, close } = usePopover();
  const fieldState = useField({
    ...props,
    value: props.value || (multiple ? [] : ''),
  });
  
  // Listeners
  const display$ = props.display$ ?? toString;
  const displayValue = useComputed$(() => display$(fieldState.value));

  useVisibleTask$(() => {
    const handler = (event: KeyboardEvent) => {
      if (preventKeys.includes(event.key)) event.preventDefault();
    }
    root.value?.addEventListener('keydown', handler);
    return () => root.value?.removeEventListener('keydown', handler);
  });
  
  const openDialog = $((el: HTMLElement) => {
    open(el);
    const selected = el.querySelector('li[role="option"][aria-selected="true"]');
    (selected) 
      ? el.setAttribute('aria-activedescendant', selected.id)
      : nextActive(el, el.querySelectorAll('li[role="option"]'));
  });

  const closeDialog = $((el: HTMLElement) => {
    close();
    el.setAttribute('aria-activedescendant', '')
  });

  const select = $((el: HTMLElement, activeId?: string | null) => {
    if (!activeId) activeId = el.getAttribute('aria-activedescendant');
    if (!activeId) return;
    const active = document.getElementById(activeId);
    if (!active) return;
    if (multiple) {
      if (active.getAttribute('aria-selected') === 'true') {
        active.setAttribute('aria-selected', 'false');
        if (active.dataset.value) {
          fieldState.value = (fieldState.value as string[]).filter(v => v === active.dataset.value);
        }
      } else {
        active.setAttribute('aria-selected', 'true');
        if (active.dataset.value) {
          fieldState.value = (fieldState.value as string[]).concat(active.dataset.value);
        }
      }
    } else {
      const selected = el.querySelector('li[role="option"][aria-selected="true"]');
      if (selected) selected.setAttribute('aria-selected', 'false');
      active.setAttribute('aria-selected', 'true')
      fieldState.value = active.dataset.value;
      if (!multiple) closeDialog(el);
    }
  });

  const onClick$ = event$((event: QwikMouseEvent<HTMLElement, MouseEvent>, el: HTMLElement) => {
    const target = event.target;
    if (target === el) {
      popover.opened ? closeDialog(el) : openDialog(el)
    }
    if (target instanceof HTMLLIElement && target.getAttribute('role') === "option") {
      select(el, target.id);
    }
  });
  
  const onKeyDown$ = event$((event: QwikKeyboardEvent<HTMLElement>, el: HTMLElement) => {
    const key = event.key;
    if (!popover.opened) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) openDialog(el);
    } else {
      if (key === 'Enter' || key === ' ') select(el);
    }
    if (key === 'ArrowDown') nextActive(el, el.querySelectorAll('li[role="option"]'));
    if (key === 'ArrowUp') previousActive(el, el.querySelectorAll('li[role="option"]'));

  });

  const onBlur$ = event$((event: QwikFocusEvent, el: HTMLElement) => {
    if (el.contains(event.relatedTarget as Node)) return;
    closeDialog(el)
  });

  return <button ref={root} type="button"
    class="field"
    role="combobox"
    tabIndex={0}
    onKeyDown$={onKeyDown$}
    onClick$={onClick$}
    onBlur$={onBlur$}
    aria-haspopup="listbox" 
    aria-autocomplete="none"
    aria-disabled="false"
    aria-invalid="false"
    aria-expanded={popover.opened}
    aria-controls={listboxId}
    >
      {displayValue}
    <svg class={popover.opened ? 'opened' : 'closed'} aria-owns={listboxId} viewBox="7 10 10 5" focusable="false">
      <polygon stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10"></polygon>
    </svg>
    <Popover>
      <Listbox id={listboxId}>
        <Slot />
      </Listbox>
    </Popover>
  </button>
});


