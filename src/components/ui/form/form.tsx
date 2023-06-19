import { QwikJSX, Signal, QwikSubmitEvent, useTask$, useSignal } from "@builder.io/qwik";
import { $, component$, createContextId, useContextProvider, useStore, Slot, useContext } from "@builder.io/qwik";
import type { FormFieldRecord, SubmitHandler } from "./types";
import { getFormValue } from "./utils";

type FormAttributes = QwikJSX.IntrinsicElements['form'];


export interface FormProps<T extends FormFieldRecord> extends Omit<FormAttributes, 'onSubmit$'> {
  onSubmit$?: SubmitHandler<T>;
  value?: Signal<T>
}

export const FormContext = createContextId<FormState<any>>('FormContext');


export interface FormState<T extends FormFieldRecord = any> {
  submitted: boolean;
  dirty: boolean;
  valid: boolean;
  value: T;
  updateCount: number;
}

export function useForm<T extends FormFieldRecord>() {
  return useContext<FormState<T>>(FormContext);
}

export const Form = component$((props: FormProps<any>) => {
  const { onSubmit$, value, ...attributes } = props;
  const ref = useSignal<HTMLFormElement>();
  const state = useStore<FormState>({
    submitted: false,
    dirty: false,
    valid: false,
    value: value?.value ?? {},
    updateCount: 0
  });
  useContextProvider<FormState<any>>(FormContext, state);

  useTask$(({ track }) => {
    track(() => state.updateCount);
    if (!ref.value) return;
    const value = getFormValue(ref.value);
    state.value = value;
  });
  
  const submit = $((event: QwikSubmitEvent<HTMLFormElement>) => {
    state.submitted = true;
    if (onSubmit$) onSubmit$(state.value, event);
  });

  return <form {...attributes} ref={ref} onSubmit$={submit} preventdefault:submit>
    <Slot/>
  </form>
});
