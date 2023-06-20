import { component$, Slot, useStyles$, useSignal, event$, useId, useContextProvider, createContextId, useContext, $, useVisibleTask$ } from "@builder.io/qwik";
import { Popover } from "../../dialog/popover";
import type { QwikKeyboardEvent , Signal , QwikMouseEvent } from "@builder.io/qwik";
import { FieldContext } from "../field";
import type { FieldProps } from "../field";
import type { DisplayProps } from "../types";
import type { SelectionItemProps } from "../selection-list/types";
import { SelectionItem, SelectionList } from "../selection-list/selection-list";
import { MultiSelectionItem, MultiSelectionList } from "../selection-list/multi-selection-list";
import styles from './select.scss?inline';
import { FormFieldContext } from "../form-field/form-field";


interface SelectProps<T = any> extends FieldProps<T>, DisplayProps<T> {
  multiple?: boolean;
  placeholder?: string;
}

const SelectContext = createContextId<{
  opened: Signal<boolean>,
  multiple: boolean;
}>('SelectContext');


export const Select = component$((props: SelectProps) => {
  useStyles$(styles);
  const { id } = useContext(FormFieldContext);
  const origin = useSignal<HTMLElement>();
  const opened = useSignal(false);
  const multiple = props.multiple ?? false;
  const display = useSignal('');
  const nameId = props.name ?? useId();
  const popoverId = useId();

  // Listeners
  const update = event$(() => {
    const value = [];
    const inputs = origin.value!.querySelectorAll<HTMLInputElement>(`input[name="${nameId}"]`);
    for (const input of inputs) {
      if (input.checked && input.value !== 'on') {
        const text = Array.from(input.labels ?? []).map(label => label.textContent).join(' ');
        value.push(text);
      }
    }
    display.value = value.join(', ');
  });
  
  const onClick$ = event$(() => {
    if (opened.value && !multiple) opened.value = false;
    if (!opened.value) opened.value = true;
  });
  
  const onKeyDown$ = event$((event: QwikKeyboardEvent<HTMLElement>) => {
    if (!opened.value) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) opened.value = true;
    } else {
      if (event.key === 'Tab') opened.value = false;
      if (!multiple) {
        if (['Enter', ' '].includes(event.key)) opened.value = false;
      }
    }
  });

  useVisibleTask$(() => {
    const form = origin.value!.querySelector<HTMLInputElement>(`input[name="${nameId}"]`)?.form;
    const handler = () => requestAnimationFrame(update);
    form?.addEventListener('reset', handler);
    return () => form?.removeEventListener('reset', handler);
  });
  
  useContextProvider(SelectContext, { multiple, opened });
  useContextProvider(FieldContext, {
    name: nameId,
    change: $(() => update())
  });

  const selectionList = multiple 
  ? <MultiSelectionList role="listbox" aria-labelledby={'label-' + id}>
    <Slot />
  </MultiSelectionList>
  : <SelectionList role="listbox" aria-labelledby={'label-' + id}>
    <Slot />
  </SelectionList>

  return <>
    <div class="field select" ref={origin}
      onKeyDown$={onKeyDown$}
      onClick$={(e, el) => e.target === el ? onClick$() : null}
      onBlur$={() => opened.value = false}
      >
      <Slot name="prefix"/>
      <button type="button" id={id}
        role="combobox"
        aria-haspopup="listbox" 
        aria-disabled="false"
        aria-invalid="false"
        aria-autocomplete="none"
        aria-expanded={opened.value}
        aria-controls={id}
        onClick$={onClick$}
      >
        <span class={display.value ? 'value' : 'placeholder'}>
          {display.value || props.placeholder}
        </span>
        <svg viewBox="7 10 10 5" class={opened.value ? 'opened' : 'closed'} aria-hidden="true" focusable="false">
          <polygon stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10"></polygon>
        </svg>
      </button>
      <Slot name="suffix"/>
      <Popover origin={origin} open={opened} position="block" id={popoverId}>
        {selectionList}
      </Popover>
    </div>
  </>
});


export const Option = component$((props: SelectionItemProps) => {
  const { multiple, opened } = useContext(SelectContext);

  const focus = event$((ev: any, el: HTMLElement) => {
    el.focus();
    // TODO: set position
  });

  if (multiple) {
    return <MultiSelectionItem {...props} role="option" onMouseEnter$={focus} >
      <Slot />
    </MultiSelectionItem>
  }

  const onClick$ = event$((event: QwikMouseEvent<HTMLElement>) => {
    // Avoid closing on input selection
    if ((event.target as HTMLElement).tagName === 'LABEL') opened.value = false;
  });
  return <SelectionItem {...props} role="option" onClick$={onClick$} onMouseEnter$={focus}>
    <Slot />
  </SelectionItem>
});