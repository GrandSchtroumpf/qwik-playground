import { $, component$, createContextId, Slot, useComputed$, useContext, useContextProvider, useId, useSignal, useStore, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import type { QwikJSX, Signal } from "@builder.io/qwik";
import { FieldContext } from "../field";
import { useSyncEvent } from "../utils";

interface ListboxState {
  ref: Signal<HTMLUListElement | undefined>;
  selected: string | string[] | null;
  active: string | null;
  multiple: boolean;
  orientation: 'vertical' | 'horizontal';
  ids: string[];
}
type ListboxService = ReturnType<typeof useListbox>;
export const ListboxContext = createContextId<ListboxService>('ListboxContext');

type UlAttributes = QwikJSX.IntrinsicElements['ul'];
interface ListboxProps extends UlAttributes {}

interface ListboxConfig {
  multiple: boolean;
  orientation: 'vertical' | 'horizontal';
}

function getConfig(config: Partial<ListboxConfig>): ListboxConfig {
  return {
    multiple: false,
    orientation: 'vertical',
    ...config
  }
} 

// TODO: implement keydown navigation from https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role#description

export const useListbox = (config: Partial<ListboxConfig> = {}) => {
  const { multiple, orientation } = getConfig(config);
  const state = useStore<ListboxState>({
    ref: useSignal<HTMLUListElement>(),
    selected: multiple ? [] : null,
    active: null,
    ids: [],
    multiple: multiple,
    orientation: orientation,
  });
  const service = {
    state,
    next: $(() => {
      if (!state.ref.value) throw new Error('Listbox element is not rendered yet');
      const options = state.ref.value.querySelectorAll('[role="option"]');
      if (!state.active) return state.active = options[0].id;
      for (let i = 0; i < options.length; i++) {
        if (options[i].id === state.active && i !== options.length - 1) {
          state.active = options[i + 1].id;
          return;
        }
      }
    }),
    previous: $(() => {
      if (!state.ref.value) throw new Error('Listbox element is not rendered yet');
      const options = state.ref.value.querySelectorAll('[role="option"]');
      if (!state.active) return state.active = options[options.length - 1].id;
      for (let i = options.length - 1; i >= 0; i--) {
        if (options[i].id === state.active && i !== 0) {
          state.active = options[i - 1].id;
          return;
        }
      }
    }),
    toggleAll: $(() => {
      if (!state.multiple) return;
      state.selected = state.selected?.length ? [] : state.ids;
    }),
    toggle: $((id: string) => {
      if (state.multiple && Array.isArray(state.selected)) {
        state.selected = state.selected.includes(id)
          ? state.selected.filter(selected => selected !== id)
          : state.selected.concat(id);
      } else {
        state.selected = state.selected === id ? null : id;
      }
    }),
    activate: $((id: string) => state.active = id)
  }
  useContextProvider(ListboxContext, service);
  return service
}


export const Listbox = component$((props: ListboxProps) => {
  const { state } = useContext(ListboxContext);

  useSyncEvent(state.ref, 'keydown', e => {
    e.preventDefault();
    e.stopPropagation();
  });

  useTask$(({ track }) => {
    track(() => state.selected);
    if (state.multiple) return;
    const ul = state.ref.value;
    const el = ul?.querySelector(`#${state.selected}`);
    if (ul && el) {
      const origin = ul.getBoundingClientRect();
      const { width, height, top, left } = el.getBoundingClientRect();
      ul.style.setProperty('--selected-width', `${width}px`);
      ul.style.setProperty('--selected-height', `${height}px`);
      ul.style.setProperty('--selected-left', `${Math.floor(left - origin.left)}px`);
      ul.style.setProperty('--selected-top', `${Math.floor(top - origin.top)}px`);
      ul.style.setProperty('--selected-display', 'block');
    } else if (ul) {
      ul.style.setProperty('--selected-display', 'none');
    }
  });

  useTask$(({ track }) => {
    track(() => state.active);
    const ul = state.ref.value;
    const el = ul?.querySelector(`#${state.active}`);
    if (ul && el) {
      const origin = ul.getBoundingClientRect();
      const { width, height, top, left } = el.getBoundingClientRect();
      ul.style.setProperty('--active-width', `${width}px`);
      ul.style.setProperty('--active-height', `${height}px`);
      ul.style.setProperty('--active-left', `${Math.floor(left - origin.left)}px`);
      ul.style.setProperty('--active-top', `${Math.floor(top - origin.top)}px`);
      ul.style.setProperty('--active-display', 'block');
    } else if (ul) {
      ul.style.setProperty('--active-display', 'none');
    }
  });

  return <>
    <ul {...props}
      ref={state.ref}
      role="listbox"
      aria-multiselectable={state.multiple}
      aria-orientation={state.orientation}
      >
      <Slot />
    </ul>
  </>;
});


export interface OptionProps<T = any> {
  value?: T;
  key: string;
}
export const Option = component$((props: OptionProps) => {
  const id = useId();
  const fieldState = useContext(FieldContext);
  const { state: listboxState, activate, toggle } = useContext(ListboxContext);
  const isActive = useComputed$(() => id === listboxState.active);
  const isSelected = useComputed$(() => {
    return Array.isArray(listboxState.selected)
      ? listboxState.selected.includes(id)
      : id === listboxState.selected;
  });
  
  useVisibleTask$(() => {
    listboxState.ids = listboxState.ids.concat(id);
    return () => listboxState.ids = listboxState.ids.filter(item => item !== id);
  });
  
  useTask$(({ track }) => {
    track(() => listboxState.selected);
    if (id === listboxState.selected) fieldState.value = props.value;
  });

  return <li class={isActive.value ? 'active' : ''}
    role="option"
    aria-selected={isSelected.value}
    id={id}
    onClick$={() => toggle(id)}
    onMouseEnter$={() => activate(id)}
  >
    <Slot />
  </li>
});