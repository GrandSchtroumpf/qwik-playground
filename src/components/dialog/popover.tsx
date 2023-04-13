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
  
  /**
   * 
   * @note the origin must have position relative
  */
  const open = $((origin: HTMLElement) => {
    const dialog = state.ref.value;
    if (!dialog) throw new Error('Cannot find dialog in the template ?');

    state.opened = true;
    const { width, height, left, top } = origin.getBoundingClientRect();
    dialog.style.setProperty('--width', `${width}px`);
    dialog.style.setProperty('--height', `${height}px`);
    if (origin.contains(dialog)) {
      dialog.style.setProperty('--left', '0');
      dialog.style.setProperty('--top', `${height}px`);
    } else {
      dialog.style.setProperty('--left', `${left}px`);
      dialog.style.setProperty('--top', `${top + height}px`);
    }
  });
  const close = $(() => closeDialog(state));
  const toggle = $((origin: HTMLElement) => state.opened ? close() : open(origin));
  return { state, open, close, toggle };
}



export const Popover = component$(() => {
  const { ref, opened, closing } = useContext(DialogContext);
  const classes = useComputed$(() => ['popover', closing ? 'closing' : ''].join(' '));
  return <dialog class={classes} ref={ref} open={opened}>
    <Slot />
  </dialog>
})