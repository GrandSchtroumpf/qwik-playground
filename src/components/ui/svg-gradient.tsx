import { component$ } from "@builder.io/qwik";

export const SvgGradient = component$(() => {
  return <svg aria-hidden="true" focusable="false">
    <linearGradient id="svg-gradient">
      <stop offset="0%" stop-color="var(--gradient-from)" />
      <stop offset="100%" stop-color="var(--gradient-to)" />
    </linearGradient>
  </svg>
});