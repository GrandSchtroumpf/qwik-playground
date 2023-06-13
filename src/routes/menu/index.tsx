import { component$, useStyles$ } from "@builder.io/qwik";
import { MenuRoot, MenuItem, Menu, MenuTrigger } from "~/components/ui/menu/menu";
import styles from './index.scss?inline';

export default component$(() => {
  useStyles$(styles);
  return <section class="menus">
    <MenuRoot>
      <MenuTrigger menuId="menu1" class="btn-fill">
        Click me
      </MenuTrigger>
      <Menu id="menu1">
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
        <MenuTrigger menuId="menu2">
          Click me
        </MenuTrigger>
      </Menu>
      <Menu id="menu2">
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
      </Menu>
    </MenuRoot>
  </section>
})