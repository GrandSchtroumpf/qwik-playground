import { useContext, component$, createContextId, Slot, useStore, useSignal, $, useComputed$, useContextProvider } from "@builder.io/qwik";
import { closeDialog } from "./utils";
import type { DialogState } from "./utils";

const DialogContext = createContextId<DialogState>('DialogContext');

export const usePopover = () => {
  const state = useStore({
    ref: useSignal<HTMLDialogElement>(),
    opened: false,
    closing: false,
  });

  useContextProvider(DialogContext, state);
  
  return {
    state,
    open: $((origin: HTMLElement) => {
      const dialog = state.ref.value;
      if (!dialog) throw new Error('Cannot find dialog in the template ?');
      state.opened = true;
      const { width, height, left, top } = origin.getBoundingClientRect();
      dialog.style.setProperty('--width', `${width}px`);
      dialog.style.setProperty('--height', `${height}px`);
      dialog.style.setProperty('--left', `${left}px`);
      dialog.style.setProperty('--top', `${top + height}px`);
    }),
    close: $(() => closeDialog(state)),
  }
}



export const Popover = component$(() => {
  const { ref, opened, closing } = useContext(DialogContext);
  const classes = useComputed$(() => ['popover', closing ? 'closing' : ''].join(' '));
  return <dialog class={classes} ref={ref} open={opened}>
    <Slot />
  </dialog>
})