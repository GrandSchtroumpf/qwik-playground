import { $, component$, useStylesScoped$ } from "@builder.io/qwik";
import { Input, Form } from "~/components/form";
import { Combobox } from "~/components/form/combobox/combobox";
import { Select } from "~/components/form/select/select";
import { Option } from "~/components/form/listbox/listbox";
import { CheckList, CheckItem, CheckAll, CheckGroup } from "~/components/form/checkbox/checkgroup";
import { RadioGroup, RadioItem, RadioList } from "~/components/form/radio/radio";
import { MultiButtonToggleGroup, MultiButtonToggleItem, MultiButtonToggleList } from "~/components/form/button-toggle/multi";
import { ButtonToggleGroup, ButtonToggleItem, ButtonToggleList } from "~/components/form/button-toggle/single";
import { SwitchGroup, SwitchItem, SwitchList } from "~/components/form/switch/switch-group";
import { Range, ThumbEnd, ThumbStart } from "~/components/form/slider/range";
import { Slider } from "~/components/form/slider/slider";
import styles from './index.scss?inline';


export default component$(() => {
  useStylesScoped$(styles);
  const onSearch$ = $((value: string) => console.log('Search', value));

  return <>
    <Form>
      <Input name="email" type="email" placeholder="email">
        Email
      </Input>
      <Input name="password" type="password" placeholder="password">
        Password
      </Input>
      <Input name="date" type="datetime-local" placeholder="Birthday">
        Birthday
      </Input>

      <Select name="types" multiple placeholder="Select multiple types">
        <Option key="a" value="a">A</Option>
        <Option key="b" value="b">B</Option>
        <Option key="c" value="c">C</Option>
        <Option key="e" value="e">E</Option>
        <Option key="f" value="f">F</Option>
      </Select>

      <Combobox name="types" multiple placeholder="Select multiple types" onSearch$={onSearch$}>
        <Option key="a" value="a">A</Option>
        <Option key="b" value="b">B</Option>
        <Option key="c" value="c">C</Option>
        <Option key="e" value="e">E</Option>
        <Option key="f" value="f">F</Option>
      </Combobox>

      <Range>
        <ThumbStart name="start"></ThumbStart>
        <ThumbEnd name="end"></ThumbEnd>
      </Range>
      <Slider></Slider>

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
  </>
});

