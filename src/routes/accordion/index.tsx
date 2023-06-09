import { component$, useStyles$ } from "@builder.io/qwik";
import { Accordion, Details, DetailsPanel, Summary } from "~/components/ui/accordion/accordion";
import { FormField, Input, Label } from "~/components/ui/form";
import styles from './index.scss?inline';

export default component$(() => {
  useStyles$(styles);
  return <Accordion>
  <Details>
    <Summary>Form</Summary>
    <DetailsPanel>
      <FormField>
        <Label>Name</Label>
        <Input placeholder="Name"/>
      </FormField>
      <FormField>
        <Label>Age</Label>
        <Input placeholder="Age" type="number"/>
      </FormField>
    </DetailsPanel>
  </Details>
  <Details>
    <Summary>List</Summary>
    <DetailsPanel>
      <ul>
        <li>One</li>
        <li>Two</li>
        <li>Three</li>
        <li>One</li>
        <li>Two</li>
        <li>Three</li>
      </ul>
    </DetailsPanel>
  </Details>
  <Details>
    <Summary>Lorem Ipsum</Summary>
    <DetailsPanel>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis reprehenderit placeat cumque voluptatem sapiente nihil id obcaecati quasi omnis officia, numquam consectetur saepe porro nisi officiis similique dolorum. Assumenda, minus.</p>
    </DetailsPanel>
  </Details>
</Accordion>
})