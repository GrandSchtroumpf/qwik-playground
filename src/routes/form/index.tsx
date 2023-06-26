import { component$, event$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Form, Input } from "~/components/ui/form";
import { Select, Option } from "~/components/ui/form/select/select";
import { Range, ThumbEnd, ThumbStart } from "~/components/ui/form/slider/range";
import { FormField, Label } from "~/components/ui/form/form-field/form-field";
import MOVIES from '~/DATA/movies.json';
import { ToggleGroup, Toggle } from "~/components/ui/form/toggle/toggle";
import { useToaster } from "~/components/ui/toaster/toaster";
import { RadioGroup, Radio } from "~/components/ui/form/radio/radio";
import { CheckAll, CheckGroup, CheckItem, CheckList } from "~/components/ui/form/checkbox/checkgroup";
import { SwitchGroup, Switch } from "~/components/ui/form/switch/switch";
import styles from './index.scss?inline';

// type Movie = typeof MOVIES[number];

export default component$(() => {
  useStyles$(styles);
  const toaster = useToaster();

  const save = event$((value: any, form: HTMLFormElement) => {
    toaster.add('Thank you 😊');
    console.log(value);
    form.reset();
  });

  const value = {
    title: 'Hello',
    select: [MOVIES[3].imdbID, MOVIES[6].imdbID],
    switch: {
      a: true,
      b: false,
    },
    range: {
      start: 10,
      end: 90
    },
    radio: 'c',
    checkbox: ['a', 'c'],
    toggle: ['medium', 'high']
  };

  return <Form class="form-page" onSubmit$={save} initialValue={value}>
      <FormField class="outlined">
        <Label>Text here</Label>
        <Input name="title" placeholder="Some Text here" />
      </FormField>
      <FormField class="outlined">
        <Label>Select from the list</Label>
        <Select name="select" placeholder="Movie" multi>
          <Option>-- Select a movie --</Option>
          {MOVIES.map(movie => (
          <Option key={movie.imdbID} value={movie.imdbID}>
            {movie.Title}
          </Option>
          ))}
        </Select>
      </FormField>
      <Range name="range" class="outlined">
        <legend>Select a range</legend>
        <ThumbStart></ThumbStart>
        <ThumbEnd></ThumbEnd>
      </Range>
      <SwitchGroup name="switch" class="outlined">
        <legend>Switches</legend>
        <Switch name="a">Switch 1</Switch>
        <Switch name="b">Switch 1</Switch>
      </SwitchGroup>
      <ToggleGroup name="toggle" class="outlined primary" multi>
        <legend>Toggle Group</legend>
        <Toggle value="low">low</Toggle>
        <Toggle value="medium">medium</Toggle>
        <Toggle value="high">high</Toggle>
      </ToggleGroup>
      <RadioGroup name="radio" class="outlined">
        <legend>Radio Group</legend>
        <Radio value="a">Radio 1</Radio>
        <Radio value="b">Radio 2</Radio>
        <Radio value="c">Radio 3</Radio>
      </RadioGroup>
      <CheckGroup name="checkbox" class="outlined">
        <legend>Some Checkbox</legend>
        <CheckAll>Check All</CheckAll>
        <CheckList>
          <CheckItem value="a">Checkbox 1</CheckItem>
          <CheckItem value="b">Checkbox 2</CheckItem>
          <CheckItem value="c">Checkbox 3</CheckItem>
        </CheckList>
      </CheckGroup>
      <footer class="form-actions">
        <button class="btn" type="reset">Cancel</button>
        <button class="btn-fill primary" type="submit">Save</button>
      </footer>
    </Form>;
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