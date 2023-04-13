import { component$, event$, useStore, useStylesScoped$ } from "@builder.io/qwik";
import { routeLoader$, routeAction$ } from "@builder.io/qwik-city";
import { useModal, Modal } from "~/components/dialog/modal";
import { Input, Form } from "~/components/form";
import { Combobox } from "~/components/form/combobox/combobox";
import { Select } from "~/components/form/select/select";
import { Option } from "~/components/form/listbox/listbox";
import { CheckList, CheckItem, CheckAll, CheckGroup } from "~/components/form/checkbox/checkgroup";
import { RadioGroup, RadioItem, RadioList } from "~/components/form/radio/radio";
import styles from './index.scss?inline';
import { MultiButtonToggleGroup, MultiButtonToggleItem, MultiButtonToggleList } from "~/components/form/button-toggle/multi";
import { ButtonToggleGroup, ButtonToggleItem, ButtonToggleList } from "~/components/form/button-toggle/single";
import { SwitchGroup, SwitchItem, SwitchList } from "~/components/form/switch/switch-group";
import { Range, ThumbEnd, ThumbStart } from "~/components/form/slider/range";
import { Slider } from "~/components/form/slider/slider";

// Form Schema
type SigninForm = {
  email: string;
  password: string;
  age: number;
  date: string;
  type: 'a' | 'b' | 'c';
  types: ('a' | 'b' | 'c')[];
}

// Initial Value
export const useSigninForm = routeLoader$<SigninForm>(() => ({
  email: 'test@test.com',
  password: '',
  age: 0,
  date: new Date().toISOString(),
  type: 'a',
  types: ['a'],
}));

// Handle submit on server
export const useSigninAction = routeAction$((values) => {
  console.log('From server', values);
});

const list = ['test@mail.com', 'toto@mail.com', 'yolo@troll.com'];

export default component$(() => {
  const initial = useSigninForm();
  const modalService = useModal();
  useStylesScoped$(styles);

  const state = useStore({
    options: list
  });

  const onSearch$ = event$((search: string) => {
    state.options = search
      ? list.filter(item => item.includes(search))
      : list;
  });

  // HTML form
  return <>
    <Form value={initial}>
      <Input name="email" type="email" placeholder="email">
        Email
      </Input>
      <Input name="password" type="password" placeholder="password">
        Password
      </Input>
      <Input name="date" type="datetime-local" placeholder="Birthday">
        Birthday
      </Input>
      {/* <Autocomplete name="email" onSearch$={onSearch$}>
        {state.options.map(v => <Option key={v} value={v}>{v}</Option>)}
      </Autocomplete> */}
      <Select name="types" multiple placeholder="Select multiple types">
        <Option key="a" value="a">A</Option>
        <Option key="b" value="b">B</Option>
        <Option key="c" value="c">C</Option>
      </Select>

      <Combobox name="types" multiple placeholder="Select multiple types" onSearch$={onSearch$}>
        <Option key="a" value="a">A</Option>
        <Option key="b" value="b">B</Option>
        <Option key="c" value="c">C</Option>
      </Combobox>

      <Range>
        <ThumbStart name="start"></ThumbStart>
        <ThumbEnd name="end"></ThumbEnd>
      </Range>
      <Slider></Slider>

      {/* <ButtonToggleGroup name="type">
        <Option key="a" value="a">Developer</Option>
        <Option key="c" value="c">CTO</Option>
        <Option key="b" value="b">Engineer</Option>
      </ButtonToggleGroup> */}

      <SwitchGroup name="settings">
        <legend>Settings</legend>
        <SwitchList>
          <SwitchItem name="audio">Audio</SwitchItem>
          <SwitchItem name="video">Video</SwitchItem>
        </SwitchList>
      </SwitchGroup>

      <ButtonToggleGroup name="type">
        <legend>This is a checklist</legend>
        <ButtonToggleList>
          <ButtonToggleItem key="a" value="hello">Hello</ButtonToggleItem>
          <ButtonToggleItem key="b" value="world">World</ButtonToggleItem>
          <ButtonToggleItem key="c" value="world">World</ButtonToggleItem>
          <ButtonToggleItem key="d" value="world">World</ButtonToggleItem>
        </ButtonToggleList>
      </ButtonToggleGroup>

      <MultiButtonToggleGroup name="type">
        <legend>This is a checklist</legend>
        <MultiButtonToggleList>
          <MultiButtonToggleItem key="a" value="hello">Hello</MultiButtonToggleItem>
          <MultiButtonToggleItem key="b" value="world">World</MultiButtonToggleItem>
          <MultiButtonToggleItem key="c" value="world">World</MultiButtonToggleItem>
          <MultiButtonToggleItem key="d" value="world">World</MultiButtonToggleItem>
        </MultiButtonToggleList>
      </MultiButtonToggleGroup>

      <CheckGroup name="type">
        <legend>This is a checklist</legend>
        <CheckAll>Check all</CheckAll>
        <CheckList>
          <CheckItem key="a" value="hello">Hello</CheckItem>
          <CheckItem key="b" value="world">World</CheckItem>
          <CheckItem key="c" value="world">World</CheckItem>
          <CheckItem key="d" value="world">World</CheckItem>
        </CheckList>
      </CheckGroup>

      <RadioGroup name="test">
        <legend>This is a radio group</legend>
        <RadioList>
          <RadioItem key="a" value="hello">Hello</RadioItem>
          <RadioItem key="b" value="world">World</RadioItem>
          <RadioItem key="c" value="world">World</RadioItem>
          <RadioItem key="d" value="world">World</RadioItem>
        </RadioList>
      </RadioGroup>

      <footer>
        <button type="reset">Cancel</button>
        <button class="fill primary" type="submit">Signin</button>
      </footer>
    </Form>

    <Modal type="sidenav">
      <section class="content">
        <h2>Save you work ?</h2>
        <p>Are you sure you want to save ?</p>
      </section>
      <footer class="actions">
        <button onClick$={() => modalService.close()}>Cancel</button>
        <button class="fill primary" onClick$={() => modalService.close()}>Save</button>
      </footer>
    </Modal>
  </>
  
});