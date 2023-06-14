import { component$, useStyles$ } from "@builder.io/qwik";
import { MenuRoot, MenuItem, Menu, MenuTrigger, MenuItemTrigger, MenuRadio, MenuGroup } from "~/components/ui/menu/menu";
import styles from './index.scss?inline';

export default component$(() => {
  useStyles$(styles);
  return <section class="menus">
    <MenuRoot>
      <MenuTrigger menuId="menu1" class="btn-fill">
        Open a menu
      </MenuTrigger>
      <Menu id="menu1">
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
        <MenuItemTrigger menuId="menu-radio">
          Menu Radio
        </MenuItemTrigger>
      </Menu>
      <Menu id="menu-radio">
        <MenuGroup>
          <MenuRadio name="radio" value="1">Item 1</MenuRadio>
          <MenuRadio name="radio" value="2">Item 2</MenuRadio>
        </MenuGroup>
      </Menu>
    </MenuRoot>
  </section>
})