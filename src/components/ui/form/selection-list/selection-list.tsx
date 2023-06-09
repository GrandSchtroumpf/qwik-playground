import { $, component$, Slot, useContext, useId, useSignal, useContextProvider, createContextId } from "@builder.io/qwik";
import { FieldContext } from "../field";
import type { FieldProps } from "../field";
import type { FieldsetAttributes, UlAttributes } from "../../types";
import type { SelectionItemProps } from "./types";
import { nextFocus, previousFocus } from "../../utils";

export interface SelectionGroupProps extends FieldProps, Omit<FieldsetAttributes, 'role' | 'tabIndex' | 'onKeyDown$'> {}

export type SelectionListService = ReturnType<typeof useSelectionList>;
export const SelectionListContext = createContextId<SelectionListService>('SelectionListContext');
export function useSelectionList() {
  const listRef = useSignal<HTMLUListElement>();
  const service = {
    listRef,
    next: $(() => nextFocus(listRef.value?.querySelectorAll('input[type="radio"]') as any)),
    previous: $(() => previousFocus(listRef.value?.querySelectorAll('input[type="radio"]') as any)),
  };
  useContextProvider(SelectionListContext, service);
  return service;
}


export const SelectionGroup = component$((props: SelectionGroupProps) => {
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


export const SelectionItem = component$((props: SelectionItemProps) => {
  const id = useId();
  const { name, change } = useContext(FieldContext);
  
  return <li {...props}>
    <input id={id} type="radio" name={name} value={props.value} onChange$={change} />
    <label for={id}>
      <Slot/>
    </label>
  </li>
});