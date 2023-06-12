import { Slot, component$, useStyles$, event$, useSignal, useVisibleTask$, createContextId, useContextProvider, useContext, $ } from "@builder.io/qwik";
import clsq from "~/components/utils/clsq";
import { useOnReset } from "../../utils";
import type { FieldsetAttributes, InputAttributes } from "../types";
import styles from './range.scss?inline';

interface RangeProps extends FieldsetAttributes {
  min?: number | string;
  max?: number | string;
  step?: number | string;
}

const RangeContext = createContextId<RangeService>('RangeContext');
const useRangeContext = () => useContext(RangeContext);

type RangeService = ReturnType<typeof useRangeProvider>;

function useRangeProvider(props: RangeProps) {
  const slider = useSignal<HTMLFieldSetElement>();
  const startInput = useSignal<HTMLInputElement>();
  const endInput = useSignal<HTMLInputElement>();
  
  const min = props.min ? Number(props.min) : 0;
  const max = props.max ? Number(props.max) : 100;
  const step = props.step ? Number(props.step) : 1;

  useVisibleTask$(() => {
    const root = slider.value;
    if (root) {
      const width = root.clientWidth - 16; // Remove padding TODO: use width of track instead
      slider.value!.style.setProperty('--start', `${min / (max - min) * width}px`);
      slider.value!.style.setProperty('--end', `${max / (max - min) * width - 16}px`);
    }
  })

  const focusLeft = event$((start: HTMLInputElement) => {
    const end = endInput.value!;
    const percent = end.valueAsNumber / (max - min) * 100;
    start.max = end.value;
    start.style.setProperty('width', `${percent}%`);
    end.style.setProperty('width', `${100 - percent}%`);
  });
  const focusRight = event$((end: HTMLInputElement) => {
    const start = startInput.value!;
    const percent = start.valueAsNumber / (max - min) * 100;
    end.min = start.value;
    start.style.setProperty('width', `${percent}%`);
    end.style.setProperty('width', `${100 - percent}%`);
  });
  const resize = event$(() => {
    const end = endInput.value!;
    const start = startInput.value!;
    const middle = start.valueAsNumber + (end.valueAsNumber - start.valueAsNumber) / 2;
    const percent = middle / (max - min) * 100;
    start.style.setProperty('width', `${percent}%`);
    end.style.setProperty('width', `${100 - percent}%`);
    end.min = start.max = middle.toString();
  });
  const move = event$((input: HTMLInputElement | undefined, mode: 'start' | 'end') => {
    if (!input) return;
    // If input have no focus yet, resize input
    if (document.activeElement !== input) {
      if (mode === 'start') focusLeft(input);
      if (mode === 'end') focusRight(input);
    }
    const root = slider.value!;
    const percent = input.valueAsNumber / (max - min);
    const width = root.clientWidth - 16; // remove padding
    const position = percent * (width - 16); // 16px is the size of the thumb
    slider.value!.style.setProperty(`--${mode}`, `${position}px`);
    input.nextElementSibling?.setAttribute('data-value', `${Math.floor(input.valueAsNumber)}`);
  });
  const service = {
    slider,
    startInput,
    endInput,
    min,
    max,
    step,
    focusLeft,
    focusRight,
    resize,
    move,
  }
  useContextProvider(RangeContext, service);
  return service;
}

export const Range = component$((props: RangeProps) => {
  useStyles$(styles);
  const { slider, move } = useRangeProvider(props);
  const { min, max } = props;
  useOnReset(slider, $(() => {
    const inputs = slider.value?.querySelectorAll<HTMLInputElement>('input');
    inputs!.item(0).value = `${min ?? 0}`;
    inputs!.item(1).value = `${max ?? 100}`;
    move(inputs?.item(0), 'start');
    move(inputs?.item(1), 'end');
  }));

  return <fieldset {...props} class={clsq('range', props.class)} ref={slider}>
    <div class="track" ></div>
    <Slot/>
  </fieldset>
});

interface ThumbProps extends Omit<InputAttributes, 'type' | 'children' | 'step' | 'min' | 'max'> {}

export const ThumbStart = component$((props: ThumbProps) => {
  useStyles$(styles);
  const { startInput, min, max, step, resize, focusLeft, move} = useRangeContext();
  return <>
    <input
      type="range" 
      name="start"
      ref={startInput}
      min={min}
      max={max}
      step={step}
      value={min}
      onFocus$={(_, el) => focusLeft(el)}
      onInput$={(_, el) => move(el, 'start')}
      onMouseUp$={resize}
      onTouchEnd$={resize}
      onTouchCancel$={resize}
      {...props} />
    <div class="thumb start" data-value={min}></div>
  </>

});
export const ThumbEnd = component$((props: ThumbProps) => {
  useStyles$(styles);
  const { endInput, min, max, step, resize, focusRight, move} = useRangeContext();
  return <>
    <input 
      type="range" 
      name="end"
      ref={endInput}
      min={min}
      max={max}
      step={step}
      value={max}
      onFocus$={(_, el) => focusRight(el)}
      onInput$={(_, el) => move(el, 'end')}
      onMouseUp$={resize}
      onTouchEnd$={resize}
      onTouchCancel$={resize}
      {...props} />
    <div class="thumb end" data-value={max}></div>
  </>
});