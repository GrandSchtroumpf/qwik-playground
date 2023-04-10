import { $, component$, Slot, useId } from "@builder.io/qwik";
import type { UlAttributes } from "../types";


interface ListboxProps extends Omit<UlAttributes, 'role' | 'onKeyDown$'>{}
export const Listbox = component$((props: ListboxProps) => {
  return <ul role="listbox" {...props}>
    <Slot/>
  </ul>
});

interface OptionGroupProps {
  label: string;
  diabled?: boolean;
}
export const OptionGroup = component$(({ label }: OptionGroupProps) => {
  return <li>
    <ul role="group">
      <h4>{label}</h4>
      <Slot/>
    </ul>
  </li>
})

interface OptionProps {
  value?: string | number | Date | boolean;
}
export const Option = component$((props: OptionProps) => {
  const id = useId();
  return <li id={id} role="option" data-value={props.value}>
    <Slot/>
  </li>
})


// UTILS

export function moveActive(ul: HTMLElement, el: HTMLElement) {
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
}

export function moveSelected(ul: HTMLElement, el: HTMLElement) {
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
}

export const nextActive = $((root: HTMLElement, list?: NodeListOf<HTMLElement>) => {
  if (!list) return;
  const activeId = root.getAttribute('aria-activedescendant');
  const oldActive = activeId ? document.getElementById(activeId) : undefined;
  if (oldActive) oldActive.classList.remove('active');
  const index = oldActive
    ? Array.from(list).indexOf(oldActive)
    : 0;
  const nextIndex = (index + 1) % list.length;
  const active = list[nextIndex];
  root.setAttribute('aria-activedescendant', active.id);
  active.classList.add('active');
});

export const previousActive = $((root: HTMLElement, list?: NodeListOf<HTMLElement>) => {
  if (!list) return;
  const activeId = root.getAttribute('aria-activedescendant');
  const oldActive = activeId ? document.getElementById(activeId) : undefined;
  if (oldActive) oldActive.classList.remove('active');
  const index = oldActive
    ? Array.from(list).indexOf(oldActive)
    : list.length - 1;
  const nextIndex = (index - 1 + list.length) % list.length;
  const active = list[nextIndex];
  root.setAttribute('aria-activedescendant', list[nextIndex].id);
  active.classList.add('active');
});