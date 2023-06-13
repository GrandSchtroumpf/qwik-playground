import type { QRL, Signal } from "@builder.io/qwik";
import { useTask$, useVisibleTask$} from "@builder.io/qwik";
import { component$, Slot, useSignal, $, useComputed$, useStyles$ } from "@builder.io/qwik";
import type { DialogAttributes } from "../types";
import styles from './dialog.scss?inline';


interface PopoverProps extends Omit<DialogAttributes, 'open'> {
  origin: Signal<HTMLElement | undefined>;
  open: Signal<boolean>;
  position: 'block' | 'inline';
  onOpen$?: QRL<() => void>
  onClose$?: QRL<() => void>
}

interface PopoverOption {
  position: PopoverProps['position'],

}


function getMenuPosition(origin: HTMLElement, dialog: HTMLDialogElement, options: PopoverOption) {
  const originRect = origin.getBoundingClientRect();
  const positionDialog = () => {
    const dialogRect = dialog.getBoundingClientRect();
    if (!dialogRect.height) return requestAnimationFrame(positionDialog);
    dialog.style.removeProperty('inset-inline-start');
    dialog.style.removeProperty('inset-inline-end');
    dialog.style.removeProperty('inset-block-start');
    dialog.style.removeProperty('inset-block-end');
    if (options.position === 'inline') {
      const overflowWidth = (dialogRect.width + originRect.width + originRect.left) > window.innerWidth;
      if (overflowWidth) dialog.style.setProperty('inset-inline-start', `-${originRect.width}px`);
      else dialog.style.setProperty('inset-inline-start', `${originRect.width}px`);
      
      const overflowHeight = (dialogRect.height + originRect.top) > window.innerHeight;
      if (overflowHeight) dialog.style.setProperty('inset-block-end', '0');
      else dialog.style.setProperty('inset-block-start', '0');
    } else {
      const overflowHeight = (dialogRect.height + originRect.height + originRect.top) > window.innerHeight;
      if (overflowHeight) dialog.style.setProperty('inset-block-end', `${originRect.height}px`);
      else dialog.style.setProperty('inset-block-start', `${originRect.height}px`);
      
      const overflowWidth = (dialogRect.width + originRect.left) > window.innerWidth;
      if (overflowWidth) dialog.style.setProperty('inset-inline-end', '0');
      else dialog.style.setProperty('inset-inline-start', '0');
    }
  }
  positionDialog();
}


export const Popover = component$((props: PopoverProps) => {
  useStyles$(styles);
  const opened = props.open;
  const origin = props.origin;
  const position = props.position ?? 'block';
  const ref = useSignal<HTMLDialogElement>();
  const closing = useSignal(false);
  const onClose$ = props.onClose$;
  const propsClass = props.class;

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
        getMenuPosition(origin.value!, ref.value!, { position });
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


  const classes = useComputed$(() => [
    'popover',
    propsClass,
    closing.value ? 'closing' : ''
  ].join(' '));

  return <dialog class={classes} ref={ref} >
    <Slot />
  </dialog>
})