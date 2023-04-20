import { $, component$, createContextId, Slot, useContext, useContextProvider, useSignal, useId } from "@builder.io/qwik";
import { FieldContext, useField } from "../field";
import type { FieldProps } from "../field";
import { nextFocus, previousFocus } from "../../utils";
import type { FieldsetAttributes, InputAttributes, UlAttributes } from "../types";

export interface MultiSelectionGroupProps extends FieldProps, Omit<FieldsetAttributes, 'onKeyDown$'> {}


type MultiSelectionListService = ReturnType<typeof useMultiSelectionList>;

export const MultiSelectionListContext = createContextId<MultiSelectionListService>('MultiSelectionListContext');


export function useMultiSelectionList(props: FieldProps) {
  useField(props);
  const listRef = useSignal<HTMLUListElement>();
  const checkAllRef = useSignal<HTMLInputElement>();
  const service = {
    listRef,
    checkAllRef,
    toggleAll: $(() => {
      if (!listRef.value) return;
      const checkboxes = listRef.value.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      let amount = 0;
      for (const checkbox of checkboxes) {
        if (checkbox.checked) amount++;
      }
      const shouldCheckAll = amount !== checkboxes.length;
      for (const checkbox of checkboxes) checkbox.checked = shouldCheckAll;
    }),
    updateMode: $(() => {
      if (!listRef.value || !checkAllRef.value) return;
      let allChecked = true;
      let someChecked = false;
      const checkboxes = listRef.value.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      for (const checkbox of checkboxes) {
        checkbox.checked
          ? someChecked = true
          : allChecked = false;
        if (someChecked && !allChecked) break;
      }
      if (allChecked) {
        checkAllRef.value.checked = true;
        checkAllRef.value.indeterminate = false;
      } else {
        checkAllRef.value.checked = false;
        checkAllRef.value.indeterminate = someChecked;
      }
    }),
    next: $(() => nextFocus(listRef.value?.querySelectorAll('input[type="checkbox"]'))),
    previous: $(() => previousFocus(listRef.value?.querySelectorAll('input[type="checkbox"]'))),
  };
  useContextProvider(MultiSelectionListContext, service);
  return service;
}


export const MultiSelectionGroup = component$((props: MultiSelectionGroupProps) => {  
  return <fieldset {...props}>
    <Slot />
  </fieldset>
});


export const MultiSelectionList = component$((props: Omit<UlAttributes, ''>) => {
  const { listRef } = useContext(MultiSelectionListContext);
  return <ul ref={listRef}  {...props}>
    <Slot />
  </ul>
});

export type MultiSelectionItemProps = Omit<InputAttributes, 'name' | 'tabIndex' | 'children'>;
export const MultiSelectionItem = component$((props: MultiSelectionItemProps) => {
  const id = useId();
  const { name } = useContext(FieldContext);
  
  return <li>
    <input id={id} type="checkbox" {...props} name={name} value={props.value} />
    <label for={id}>
      <Slot/>
    </label>
  </li>
});