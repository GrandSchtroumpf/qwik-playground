import { component$, event$, Slot, useStylesScoped$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import type { QwikKeyboardEvent } from "@builder.io/qwik";
import type { LinkProps } from "@builder.io/qwik-city";
import styles from './navlist.scss?inline';

// interface WithViewTransition extends Document {
//   startViewTransition: (cb: (() => any)) => Promise<any>
// }

// function hasViewTransition(doc: Document): doc is WithViewTransition {
//   return ('startViewTransition' in doc);
// }

export const Navbar = component$(() => {
  useStylesScoped$(styles);
  const move = event$((event: QwikKeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight') return;
  });
  return <nav>
    <ul role="list" class="navbar" onKeyDown$={move}>
      <Slot/>
    </ul>
  </nav>
})

export const Navlist = component$(() => {
  useStylesScoped$(styles);
  return <nav>
    <ul role="list" class="navlist">
      <Slot/>
    </ul>
  </nav>
});

export const Navlink = component$<LinkProps>((props) => {
  const { url } = useLocation();
  const { href } = props;
  // TODO: compare location with href

  // const nav = useNavigate();
  // const navigate = event$(() => {
  //   if (!href) return;
  //   if (!hasViewTransition(document)) return nav(href);
  //   document.startViewTransition(() => nav(href));
  // });
  const linkProps = {
    ...props,
    'aria-current': url.pathname === href ? 'page' as const : undefined
  } 
  
  return <li>
    <Link {...linkProps}>
      <Slot/>
    </Link>
  </li>
});