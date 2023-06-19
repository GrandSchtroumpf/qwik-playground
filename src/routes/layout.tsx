import { component$, Slot, useSignal, useStyles$, useVisibleTask$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { Slider } from '~/components/ui/form/slider/slider';
import { SvgGradient } from '~/components/ui/svg-gradient';
import { Toaster, useToasterProvider } from '~/components/ui/toaster/toaster';
import clsq from '~/components/utils/clsq';
import styles from './layout.scss?inline';

export default component$(() => {
  useStyles$(styles);
  useToasterProvider();

  const hue = useSignal('0');
  const open = useSignal(false);
  useVisibleTask$(({ track }) => {
    track(() => hue.value);
    document.documentElement.style.setProperty('--hue', hue.value);
  })
  return <>
    <nav aria-label="primary" onClick$={() => open.value = false} class={clsq('main-nav', open.value ? 'open' : 'close')}>
      <ul role="list">
        <li>
          <Link class="btn-list" href="/">Theme</Link>
        </li>
        <li>
          <Link class="btn-list" href="/form">Form</Link>
        </li>
        <li>
          <Link class="btn-list" href="/accordion">Accordion</Link>
        </li>
        <li>
          <Link class="btn-list" href="/tabs">Tabs</Link>
        </li>
        <li>
          <Link class="btn-list" href="/menu">Menu</Link>
        </li>
        <li>
          <Link class="btn-list" href="/button">Button</Link>
        </li>
      </ul>
    </nav>
    <header class="page-header">
      <button class="btn-icon sidenav-trigger" onClick$={() => open.value = true}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      </button>
      <h1>Playground</h1>
      <label class="hue-slider">
        Hue
        <Slider position="end" min="0" max="360" onChange$={(e, input) => hue.value = input.value}></Slider>
      </label>
    </header>
    <main>
      <Slot />
    </main>
    <Toaster/>
    <SvgGradient/>
  </>;
});
