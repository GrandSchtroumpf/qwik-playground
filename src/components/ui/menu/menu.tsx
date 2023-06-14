import { component$, createContextId, Slot, useContext, useContextProvider, useSignal, useId, useStyles$, $ } from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";
import { Popover } from "../dialog/popover";
import type { ButtonAttributes, DivAttributes, InputAttributes, MenuAttributes } from "../types";
import { useKeyboard, nextFocus, previousFocus } from "../utils";
import styles from './menu.scss?inline';
import clsq from "~/components/utils/clsq";

interface MenuContext  {
  root: Signal<HTMLElement | undefined>;
  menus: Record<string, {
    menuId: string;
    triggerId: string;
    origin: Signal<HTMLElement | undefined>;
    open: Signal<boolean>;
  }>
} 

const MenuContext = createContextId<MenuContext>('MenuContext');

export const MenuRoot = component$((props: DivAttributes) => {
  useStyles$(styles);
  const root = useSignal<HTMLElement>();
  useContextProvider(MenuContext, { root, menus: {}});
  return <div {...props} ref={root} class={clsq('menu-root', props.class)}>
    <Slot/>
  </div>
});


interface MenuTriggerProps extends Omit<ButtonAttributes, 'ref' | 'onClick$'> {
  menuId: string;
}
export const MenuTrigger = component$((props: MenuTriggerProps) => {
  const {menus} = useContext(MenuContext);
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
  const {root, menus} = useContext(MenuContext);
  const list = useSignal<HTMLElement>();
  useKeyboard(list, ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'], $((event, el) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextFocus(el.querySelectorAll<HTMLElement>('button, input'))
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      previousFocus(el.querySelectorAll<HTMLElement>('button, input'))
    }
  }));
  const { menuId, triggerId, origin, open } = menus[props.id];
  return <Popover origin={origin} open={open} layer={root} position="inline" class="menu-overlay">
    <menu ref={list} id={menuId} role="menu" class="menu-list" aria-labelledby={triggerId}>
      <Slot />
    </menu>
  </Popover>
});

export const MenuItem = component$((props: ButtonAttributes) => {
  const {menus} = useContext(MenuContext);
  const closeAll = $(() => {
    for (const menu of Object.values(menus)) menu.open.value = false;
  })
  return <li role="presentation">
    <button type="button" role="menuitem" {...props} onClick$={closeAll}>
      <Slot/>
    </button>
  </li>
});


export const MenuItemTrigger = component$((props: MenuTriggerProps) => {
  return <li role="presentation">
    <MenuTrigger role="menuitem" {...props}>
      <Slot/>
      <svg viewBox="0 0 5 10" width="5" height="10" focusable="false" aria-hidden="true" fill="currentColor">
        <polygon points="0,0 5,5 0,10"></polygon>
      </svg>
    </MenuTrigger>
  </li>
})


export const MenuGroup = component$(() => {
  return <fieldset>
    <Slot/>
  </fieldset>
})

type RadioItemProps = Omit<InputAttributes, 'type' | 'children'>;
export const MenuRadio = component$((props: RadioItemProps) => {
  const id = useId();
  return <li class="menu-radio">
    <input id={id} role="menuitemradio" type="radio" {...props} value={props.value} />
    <label for={id}>
      <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
        <circle r="8" cx="12" cy="12"/>
      </svg>
      <Slot/>
    </label>
  </li>
});


export const MenuCheckbox = component$(() => {
  // TODO 
  return <li role="menuitemcheckbox">
  </li>
});