import { component$ } from '@builder.io/qwik';
import type { DocumentHead} from '@builder.io/qwik-city';
import { Link} from '@builder.io/qwik-city';
import { globalAction$, routeLoader$ } from '@builder.io/qwik-city';
import { api } from '~/api';
import type { Video } from '~/api/models';

// routeLoader is retriggered after
export const useVideos = routeLoader$(() => {
  return api.query('video');
})

export const useAdd = globalAction$(() => {
  api.add('user', { name: 'Test' })
})

const Item = component$(({ video }: { video: Video }) => {
  return <li>
    <Link href={'/video/'+video._id}>{video.name}</Link>
  </li>
})

export default component$(() => {
  const videos = useVideos();
  const add = useAdd();
  if (!videos.value?.length) return <button onClick$={() => add.submit()}>Create one</button>;
  return <>
    <header>
      <h1>List</h1>
      <button onClick$={() => add.submit()}>Add new video</button>  
    </header>  
    <ul role="list" class="column">
      {videos.value.map(video => <Item video={video} key={video.name}/>)}
    </ul>
  </>
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
