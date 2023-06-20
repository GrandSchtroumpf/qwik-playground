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

  const save = event$((_: any, form: HTMLFormElement) => {
    toaster.add('Thank you 😊');
    form.reset();
  })

  return <>
    <Form onSubmit$={save}>
      <FormField class="outlined">
        <Label>Text here</Label>
        <Input name="title" placeholder="Some Text here" />
      </FormField>
      <FormField class="outlined">
        <Label>Select from the list</Label>
        <Select name="select" placeholder="Movie">
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
        <legend>Some Switch</legend>
        <Switch name="1">Switch 1</Switch>
        <Switch name="2">Switch 2</Switch>
      </SwitchGroup>
      <ToggleGroup name="toggle" class="outlined primary">
        <legend>Toggle Group</legend>
        <Toggle value="low">low</Toggle>
        <Toggle value="medium">medium</Toggle>
        <Toggle value="high">high</Toggle>
      </ToggleGroup>
      <RadioGroup name="radio" class="outlined">
        <legend>Some radio</legend>
        <Radio value="1">Radio 1</Radio>
        <Radio value="2">Radio 2</Radio>
        <Radio value="3">Radio 3</Radio>
      </RadioGroup>
      <CheckGroup name="checkbox" class="outlined">
        <legend>Some Checkbox</legend>
        <CheckAll>Check All</CheckAll>
        <CheckList>
          <CheckItem value="1">Checkbox 1</CheckItem>
          <CheckItem value="2">Checkbox 2</CheckItem>
          <CheckItem value="3">Checkbox 3</CheckItem>
        </CheckList>
      </CheckGroup>
      <footer class="form-actions">
        <button class="btn" type="reset">Cancel</button>
        <button class="btn-fill primary" type="submit">Save</button>
      </footer>
    </Form>
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