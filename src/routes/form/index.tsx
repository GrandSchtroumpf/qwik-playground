import { component$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Input } from "~/components/ui/form";
import { Select, Option } from "~/components/ui/form/select/select";
import { SwitchGroup, SwitchItem, SwitchList } from "~/components/ui/form/switch/switch-group";
import { Range, ThumbEnd, ThumbStart } from "~/components/ui/form/slider/range";
import { FormField, Label } from "~/components/ui/form/form-field/form-field";
import MOVIES from '~/DATA/movies.json';
import styles from './index.scss?inline';

// type Movie = typeof MOVIES[number];

export default component$(() => {
  useStyles$(styles);
  return <>
    <form >
      <FormField>
        <Label>Text here</Label>
        <Input name="title" placeholder="Some Text here" />
      </FormField>
      <FormField>
        <Label>Select from the list</Label>
        <Select placeholder="Movie">
          <Option>-- Select a movie --</Option>
          {MOVIES.map(movie => (
          <Option key={movie.imdbID} value={movie.imdbID}>
            {movie.Title}
          </Option>
          ))}
        </Select>
      </FormField>
      <Range>
        <ThumbStart></ThumbStart>
        <ThumbEnd></ThumbEnd>
      </Range>
      <SwitchGroup>
        <legend>Some Switch</legend>
        <SwitchList>
          <SwitchItem>Switch 1</SwitchItem>
          <SwitchItem>Switch 2</SwitchItem>
        </SwitchList>
      </SwitchGroup>
      <footer class="form-actions">
        <button class="btn" type="reset">Cancel</button>
        <button class="btn-fill" type="submit">Save</button>
      </footer>
    </form>
  </>;
});

export const head: DocumentHead = () => {
  return {
    title: "Form",
    meta: [
      {
        name: 'description',
        content: 'An example of form using several components built with Qwik',
      }
    ],
  };
};