import type { QRL, Signal } from "@builder.io/qwik";
import { useTask$, useVisibleTask$} from "@builder.io/qwik";
import { component$, Slot, useSignal, $, useComputed$, useStyles$ } from "@builder.io/qwik";
import type { DialogAttributes } from "../types";
import styles from './dialog.scss?inline';


interface PopoverProps extends Omit<DialogAttributes, 'open'> {
  origin: Signal<HTMLElement | undefined>;
  open: Signal<boolean>;
  onOpen$?: QRL<() => void>
  onClose$?: QRL<() => void>
}

interface PopoverOption {
  position: 'block' | 'inline',

}

function getMenuPosition(origin: HTMLElement, dialog: HTMLDialogElement, options: PopoverOption) {
  const originRect = origin.getBoundingClientRect();
  const positionDialog = () => {
    const dialogRect = dialog.getBoundingClientRect();
    if (!dialogRect.height) return requestAnimationFrame(positionDialog);
    const overflowWidth = dialogRect.width + originRect.left > window.innerWidth;
    const overflowHeight = dialogRect.height + originRect.top > window.innerHeight;
    const inset = { top: 0, left: 0, right: 0, bottom: 0 };
    if (options.position === 'inline') {
      if (overflowHeight) inset.top = window.innerWidth - dialogRect.width + originRect.left;
      if (overflowWidth) inset.right = originRect.width;
      else inset.left = originRect.width;
    } else {      
      if (overflowWidth) inset.right = window.innerWidth - dialogRect.width + originRect.left;
      if (overflowHeight) inset.bottom = originRect.height;
      else inset.top = originRect.height;
    }
    for (const [key, value] of Object.entries(inset)) {
      if (!value) dialog.style.removeProperty(key);
      if (value) dialog.style.setProperty(key, `${value}px`);
    }
  }
  positionDialog();
}


export const Popover = component$((props: PopoverProps) => {
  useStyles$(styles);
  const opened = props.open;
  const origin = props.origin;
  const ref = useSignal<HTMLDialogElement>();
  const closing = useSignal(false);
  const onClose$ = props.onClose$;

  const position = $((dialog: HTMLDialogElement) => {
    // Wait until we know the height of the dialog
    if (!origin.value) throw new Error('No origin provided for dialog');
    getMenuPosition(origin.value, dialog, { position: 'block' });
  });

  const close = $(() => {
    if (!ref.value) return;
    closing.value = true;
    if (onClose$) onClose$();
    setTimeout(() => {
      closing.value = false;
      ref.value?.close();
    }, 200);
  });

  useTask$(({ track }) => {
    track(() => opened.value);
    if (opened.value) {
      if (window.matchMedia("(min-width: 600px)").matches) {
        const handler = (event: Event) => {
          const outside = event.target !== ref.value && !ref.value?.contains(event.target as HTMLElement);
          if (outside) opened.value = false;
        }
        position(ref.value!);
        ref.value!.show();
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
      } else {
        const handler = (event: Event) => {
          if (event.target === ref.value) opened.value = false;
        }
        ref.value!.showModal();
        ref.value?.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
      }
    } else {
      close();
    }
  });

  // prevent default closing to keep state in sync
  useVisibleTask$(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        opened.value = false;
      }
    }
    ref.value?.addEventListener("keydown", handler);
    return (() => ref.value?.removeEventListener("keydown", handler));
  });


  const classes = useComputed$(() => ['popover', closing.value ? 'closing' : ''].join(' '));
  return <dialog class={classes} ref={ref} >
    <Slot />
  </dialog>
})