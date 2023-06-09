import { component$, createContextId, Slot, useContext, useContextProvider, useSignal, useId, useStyles$ } from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";
import { Popover } from "../dialog/popover";
import { Checkbox } from "../form/checkbox/checkbox";
import { RadioItem } from "../form/radio/radio";
import type { ButtonAttributes, DivAttributes } from "../types";
import styles from './menu.scss?inline';
import clsq from "~/components/utils/clsq";

interface MenuContext {
  menuId: string;
  triggerId: string;
  origin: Signal<HTMLElement>;
  open: Signal<boolean>;
}

const MenuContext = createContextId<MenuContext>('MenuContext');

export const Menu = component$((props: DivAttributes) => {
  useStyles$(styles);
  const menuId = useId();
  const triggerId = useId();
  const open = useSignal(false);
  const origin = useSignal<HTMLElement>();
  useContextProvider(MenuContext, { menuId, triggerId, open, origin });
  return <div {...props} class={clsq('menu-root', props.class)} ref={origin}>
    <Slot/>
  </div>
});

type MenuTriggerProps = Omit<ButtonAttributes, 'ref' | 'onClick$'>
export const MenuTrigger = component$((props: MenuTriggerProps) => {
  const { menuId, triggerId, open } = useContext(MenuContext);
  return <button {...props}
    type="button"
    id={triggerId}
    onClick$={() => open.value = true}
    aria-haspopup="true"
    aria-controls={menuId}
  >
    <Slot />
  </button>
});

// TODO: create ContextMenu element
// type ContextMenuTriggerProps = Omit<ButtonAttributes, 'ref' | 'onContextMenu$'>
// export const ContextMenuTrigger = component$((props: ContextMenuTriggerProps) => {
//   const { menuId, triggerId, origin, open } = useContext(MenuContext);
//   return <button {...props}
//     ref={origin}
//     id={triggerId}
//     onContextMenu$={() => open.value = true}
//     aria-haspopup="true"
//     aria-controls={menuId}
//   >
//     <Slot />
//   </button>
// });

export const MenuList = component$(() => {
  const list = useSignal<HTMLElement>();
  // useKeyboard(list, ['ArrowRight'], (event) => );
  const { menuId, triggerId, origin, open } = useContext(MenuContext);
  return <Popover origin={origin} open={open}>
    <menu ref={list} id={menuId} role="menu" class="menu-list" aria-labelledby={triggerId}>
      <Slot />
    </menu>
  </Popover>
});


export const MenuItem = component$((props: ButtonAttributes) => {
  return <li role="presentation">
    <button type="button" role="menuitem" {...props}>
      <Slot/>
    </button>
  </li>
});

export const MenuRadio = component$(() => {
  // TODO how to manage name
  return <li role="menuitemradio">
    <RadioItem>
      <Slot/>
    </RadioItem>
  </li>
});

export const MenuCheckbox = component$(() => {
  // TODO how to manage name
  return <li role="menuitemcheckbox">
    <Checkbox>
      <Slot/>
    </Checkbox>
  </li>
});