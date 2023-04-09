import { $, component$, Slot, useContext, useId, useSignal, useContextProvider, createContextId } from "@builder.io/qwik";
import { FieldContext, useField } from "../field";
import type { FieldProps } from "../field";
import type { FieldsetAttributes, InputAttributes, UlAttributes } from "../types";
import { nextFocus, previousFocus } from "../utils";

export interface SelectionGroupProps extends FieldProps, Omit<FieldsetAttributes, 'role' | 'tabIndex' | 'onKeyDown$'> {}

export type SelectionListService = ReturnType<typeof useSelectionList>;
export const SelectionListContext = createContextId<SelectionListService>('SelectionListContext');
export function useSelectionList() {
  const listRef = useSignal<HTMLUListElement>();
  const service = {
    listRef,
    next: $(() => nextFocus(listRef.value?.querySelectorAll('input[type="radio"]'))),
    previous: $(() => previousFocus(listRef.value?.querySelectorAll('input[type="radio"]'))),
  };
  useContextProvider(SelectionListContext, service);
  return service;
}


export const SelectionGroup = component$((props: SelectionGroupProps) => {
  useField(props);
  return <fieldset {...props} role="radiogroup">
    <Slot />
  </fieldset>
});

export type SelectionListProps = UlAttributes;
export const SelectionList = component$((props: SelectionListProps) => {
  return <ul {...props}>
    <Slot />
  </ul>
});

export type SelectionItemProps = Omit<InputAttributes, 'type' | 'name' | 'tabIndex' | 'children'>;
export const SelectionItem = component$((props: SelectionItemProps) => {
  const id = useId();
  const { name } = useContext(FieldContext);
  
  return <li>
    <input id={id} type="radio" {...props} name={name} value={props.value} />
    <label for={id}>
      <Slot/>
    </label>
  </li>
});