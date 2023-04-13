import { component$, Slot, useStylesScoped$ } from '@builder.io/qwik';
import { Navlink, Navbar } from '~/components/navigation/navlist';
import styles from './layout.scss?inline';


const MainNav = component$(() => {
  useStylesScoped$(styles);
  return <Navbar>
    <Navlink href="/">Explorer</Navlink>
    <Navlink href="/marketplace">Marketplace</Navlink>
  </Navbar>
})

export default component$(() => {
  useStylesScoped$(styles);
  return <>
    <header class="page-header">
      <h1>Forms Components</h1>
    </header>
    <main>
      <Slot />
    </main>
    <footer class="page-header">
      <MainNav/>
    </footer>
  </>;
});
