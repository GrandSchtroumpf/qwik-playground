// import { $, component$,  Slot, useContext, useId, useSignal, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
// import { Checkbox } from "./checkbox";
// import { useMultiSelectionList, MultiSelectionListContext } from '../selection-list/multi-selection-list';
// import type { QwikKeyboardEvent} from "@builder.io/qwik";
// import { FieldContext, useField,  } from "../field";
// import type { FieldProps } from "../field";
// import type { MultiSelectionGroupProps} from '../selection-list/multi-selection-list';
// import type { FieldsetAttributes, UlAttributes } from "../../types";
// import styles from './checkbox.scss?inline';

// export interface CheckgroupProps extends FieldProps, Omit<FieldsetAttributes, 'role' | 'tabIndex' | 'onKeyDown$'> {}

// const disabledKeys = ['Enter', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'];
// export const CheckGroup = component$((props: MultiSelectionGroupProps) => {
//   useStyles$(styles);
//   useField(props);
//   const { checkAllRef, toggleAll, next, previous } = useMultiSelectionList(props);
//   const root = useSignal<HTMLElement>();
//   const lastActive = useSignal<HTMLElement | null>();

//   // Prevent default behavior
//   useVisibleTask$(() => {
//     const handler = (event: KeyboardEvent) => {
//       if (disabledKeys.includes(event.key)) event.preventDefault();
//     }
//     root.value?.addEventListener('keydown', handler);
//     return () => root.value?.removeEventListener('keydown', handler);
//   });

//   // Create new behavior
//   const onKeyDown$ = $((event: QwikKeyboardEvent<HTMLInputElement>) => {
//     const key = event.key;
//     if (event.ctrlKey && key === 'a') toggleAll();
//     if (key === 'ArrowDown') next();
//     if (key === 'ArrowUp') previous();
//     if (key === 'ArrowLeft') {
//       lastActive.value = document.activeElement as HTMLElement;
//       checkAllRef.value?.focus();
//     }
//     if (key === 'ArrowRight') {
//       (lastActive.value) ? lastActive.value.focus() : next();
//     }
//     if (event.target instanceof HTMLInputElement) {
//       const radio = event.target;
//       if (key === 'Enter') radio.checked = !radio.checked;
//     }
//   });

//   return <fieldset ref={root} class="check-group" onKeyDown$={onKeyDown$} {...props}>
//     <Slot />
//   </fieldset>
// })


// export const CheckAll = component$(() => {
//   useStyles$(styles);
//   const { checkAllRef, toggleAll } = useContext(MultiSelectionListContext);
//   return <Checkbox ref={checkAllRef} onChange$={toggleAll}>
//     <Slot />
//   </Checkbox>
// })

// export const CheckList = component$((props: UlAttributes) => {
//   useStyles$(styles);
//   const { listRef } = useContext(MultiSelectionListContext);
//   return <ul ref={listRef} {...props}>
//     <Slot />
//   </ul>
// })

// interface CheckItemProps {
//   value: string;
// }

// export const CheckItem = component$((props: CheckItemProps) => {
//   useStyles$(styles);
//   const { updateMode } = useContext(MultiSelectionListContext);
//   const id = useId();
//   const { name } = useContext(FieldContext);
  
//   return <li>
//     <input id={id} type="checkbox" {...props} name={name} value={props.value} onChange$={updateMode}/>
//     <label for={id}>
//       <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
//         <path fill="none"></path>
//       </svg>
//       <Slot/>
//     </label>
//   </li>
// })