import { component$, useId, Slot, createContextId, useContextProvider, useContext, useStyles$ } from "@builder.io/qwik";
import styles from './form-field.scss?inline';

interface FormFieldState {
  id: string;
}

export const FormFieldContext = createContextId<FormFieldState>('FormFieldContext');

export const FormField = component$(() => {
  useStyles$(styles);
  const id = useId();
  useContextProvider(FormFieldContext, { id })
  return <div class="form-field">
    <Slot/>
  </div>
});

export const Label = component$(() => {
  const { id } = useContext(FormFieldContext);
  return <label for={id}>
    <Slot/>
  </label>
})