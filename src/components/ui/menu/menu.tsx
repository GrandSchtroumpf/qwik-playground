import { component$, createContextId, Slot, useContext, useContextProvider, useSignal, useId, useStyles$, $ } from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";
import { Popover } from "../dialog/popover";
import { Checkbox } from "../form/checkbox/checkbox";
import { RadioItem } from "../form/radio/radio";
import type { ButtonAttributes, DivAttributes, MenuAttributes } from "../types";
import { useKeyboard, nextFocus, previousFocus } from "../utils";
import styles from './menu.scss?inline';
import clsq from "~/components/utils/clsq";

type MenuContext = Record<string, {
  menuId: string;
  triggerId: string;
  origin: Signal<HTMLElement | undefined>;
  open: Signal<boolean>;
}>

const MenuContext = createContextId<MenuContext>('MenuContext');

export const MenuRoot = component$((props: DivAttributes) => {
  useStyles$(styles);
  useContextProvider(MenuContext, {});
  return <div {...props} class={clsq('menu-root', props.class)}>
    <Slot/>
  </div>
});


interface MenuTriggerProps extends Omit<ButtonAttributes, 'ref' | 'onClick$'> {
  menuId: string;
}
export const MenuTrigger = component$((props: MenuTriggerProps) => {
  const menus = useContext(MenuContext);
  const ref = useSignal<HTMLElement>();
  const triggerId = useId();
  const menuId = props.menuId;
  menus[props.menuId] ||= {
    menuId: menuId,
    triggerId: triggerId,
    open: useSignal(false),
    origin: ref
  };
  return <button {...props}
    ref={ref}
    class={clsq('menu-trigger', props.class)}
    type="button"
    id={triggerId}
    onClick$={() => menus[menuId].open.value = true}
    aria-haspopup="menu"
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

interface MenuProps extends MenuAttributes {
  id: string;
}
export const Menu = component$((props: MenuProps) => {
  const list = useSignal<HTMLElement>();
  useKeyboard(list, ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'], $((event, el) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      nextFocus(el.querySelectorAll<HTMLElement>('button, input'))
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      previousFocus(el.querySelectorAll<HTMLElement>('button, input'))
    }
  }));
  const menus = useContext(MenuContext);
  const { menuId, triggerId, origin, open } = menus[props.id];
  return <Popover origin={origin} open={open} position="inline" class="menu-overlay">
    <menu ref={list} id={menuId} role="menu" class="menu-list" aria-labelledby={triggerId}>
      <Slot />
    </menu>
  </Popover>
});

export const MenuItem = component$((props: ButtonAttributes) => {
  const menus = useContext(MenuContext);
  const closeAll = $(() => {
    for (const menu of Object.values(menus)) menu.open.value = false;
  })
  return <li role="presentation">
    <button type="button" role="menuitem" {...props} onClick$={closeAll}>
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