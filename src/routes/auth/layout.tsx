import { component$, Slot } from "@builder.io/qwik";


export default component$(() => {
  return <>
    <header>
      <h1>Connection</h1>
    </header>
    <Slot/>
  </>
});