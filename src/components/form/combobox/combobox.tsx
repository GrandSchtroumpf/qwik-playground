import { $, component$, Slot, useComputed$, useStylesScoped$, useSignal, event$, useVisibleTask$, useId } from "@builder.io/qwik";
import { usePopover, Popover } from "../../dialog/popover";
import { useField } from "../field";
import type { QwikKeyboardEvent, QwikMouseEvent, QwikFocusEvent, QRL } from "@builder.io/qwik";
import type { FieldProps } from "../field";
import type { DisplayProps } from "../types";
import { toString } from "../utils";
import { nextActive, previousActive, Listbox } from "../listbox/listbox";
import styles from './combobox.scss?inline';


interface ComboboxProps<T = any> extends FieldProps<T>, DisplayProps<T> {
  onSearch$: QRL<(value: string) => any>
  multiple?: boolean;
  placeholder?: string;
}


const preventKeys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Enter', ' '];
export const Combobox = component$((props: ComboboxProps) => {
  useStylesScoped$(styles);
  const listboxId = useId();
  const root = useSignal<HTMLElement>();
  const input = useSignal<HTMLElement>();
  const onSearch$ = props.onSearch$;
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

  useVisibleTask$(() => {
    const handler = (event: KeyboardEvent) => {
      if (preventKeys.includes(event.key)) event.preventDefault();
    }
    input.value?.addEventListener('keydown', handler);
    return () => input.value?.removeEventListener('keydown', handler);
  });
  
  const openDialog = $((el: HTMLElement) => {
    open(el);
    const selected = el.querySelector('li[role="option"][aria-selected="true"]');
    (selected) 
      ? input.value!.setAttribute('aria-activedescendant', selected.id)
      : nextActive(el, el.querySelectorAll('li[role="option"]'));
  });

  const closeDialog = $(() => {
    close();
    input.value!.setAttribute('aria-activedescendant', '')
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
      if (!multiple) closeDialog();
    }
  });


  const onClick$ = event$((event: QwikMouseEvent<HTMLElement, MouseEvent>) => {
    const el = root.value!;
    const target = event.target;
    if (target instanceof HTMLLIElement && target.getAttribute('role') === "option") {
      select(el, target.id);
    }
  });
  
  const onKeyDown$ = event$((event: QwikKeyboardEvent<HTMLElement>) => {
    const el = root.value!;
    const key = event.key;
    if (!popover.opened) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) openDialog(el);
    } else {
      if (key === 'Enter' || key === ' ') select(el);
    }
    if (key === 'ArrowDown') nextActive(input.value!, el.querySelectorAll('li[role="option"]'));
    if (key === 'ArrowUp') previousActive(input.value!, el.querySelectorAll('li[role="option"]'));
  });

  const onFocus$ = event$(() => {
    const el = root.value!;
    popover.opened ? closeDialog() : openDialog(el)
  });

  const onBlur$ = event$((event: QwikFocusEvent) => {
    const el = root.value!;
    if (el.contains(event.relatedTarget as Node)) return;
    closeDialog()
  });

  return <div class="field" ref={root} onClick$={onClick$}>
    <input ref={input}
      value={displayValue.value}
      class="field"
      role="combobox"
      onKeyDown$={onKeyDown$}
      onFocus$={onFocus$}
      onBlur$={onBlur$}
      onInput$={(_, el) => onSearch$(el.value)}
      aria-haspopup="listbox" 
      aria-disabled="false"
      aria-invalid="false"
      aria-autocomplete="list"
      aria-expanded={popover.opened}
      aria-controls={listboxId}
    />
    <Popover>
      <Listbox id={listboxId}>
        <Slot />
      </Listbox>
    </Popover>

  </div>
});