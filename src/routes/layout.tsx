import { component$, Slot, useStylesScoped$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
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
      <MainNav/>
      <Link href="/auth/signin" class="btn">
        Signin
      </Link>
    </header>
    <main>
      <Slot />
    </main>
    <footer class="page-header">
      <MainNav/>
    </footer>
  </>;
});
