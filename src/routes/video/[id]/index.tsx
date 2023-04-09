import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { api } from "~/api";

export const useVideo = routeLoader$(async (event) => {
  return api.get('video', event.params.id);
});


export default component$(() => {
  const video = useVideo();
  useVisibleTask$(() => {
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ collection: 'user', method: 'watch', params: [] })
    });
  })
  return <>
    <header>
      <a href="/">Back</a>
      <h1>{video.value?.name}</h1>
    </header>
  </>
});