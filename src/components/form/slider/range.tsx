import { Slot, component$, useStylesScoped$, event$, useSignal, useVisibleTask$, createContextId, useContextProvider, useContext } from "@builder.io/qwik";
import type { FieldsetAttributes, InputAttributes } from "../types";
import styles from './range.scss?inline';

interface RangeProps extends FieldsetAttributes {
  min?: number | string;
  max?: number | string;
}

const RangeContext = createContextId<RangeService>('RangeContext');
const useRangeContext = () => useContext(RangeContext);

type RangeService = ReturnType<typeof useRangeProvider>;

function useRangeProvider(props: RangeProps) {
  const slider = useSignal<HTMLElement>();
  const startInput = useSignal<HTMLInputElement>();
  const endInput = useSignal<HTMLInputElement>();
  
  const min = props.min ? Number(props.min) : 0;
  const max = props.max ? Number(props.max) : 100;

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
  const change = event$(() => {
    const end = endInput.value!;
    const start = startInput.value!;
    const middle = start.valueAsNumber + (end.valueAsNumber - start.valueAsNumber) / 2;
    const percent = middle / (max - min) * 100;
    start.style.setProperty('width', `${percent}%`);
    end.style.setProperty('width', `${100 - percent}%`);
    end.min = start.max = middle.toString();
  });
  const move = event$((input: HTMLInputElement, mode: 'start' | 'end') => {
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
    input.nextElementSibling?.setAttribute('data-value', input.value);
  });
  const service = {
    slider,
    startInput,
    endInput,
    min,
    max,
    focusLeft,
    focusRight,
    change,
    move,
  }
  useContextProvider(RangeContext, service);
  return service;
}

export const Range = component$((props: RangeProps) => {
  useStylesScoped$(styles);
  const { slider } = useRangeProvider(props);

  return <fieldset class="range" ref={slider}>
    <div class="track" ></div>
    <Slot/>
  </fieldset>
});

interface ThumbProps extends Omit<InputAttributes, 'type' | 'children'> {}

export const ThumbStart = component$((props: ThumbProps) => {
  useStylesScoped$(styles);
  const { startInput, min, max, change, focusLeft, move} = useRangeContext();
  return <>
    <input
      type="range" 
      ref={startInput}
      min={min}
      max={max}
      value={min}
      onChange$={() => change()}
      onFocus$={(_, el) => focusLeft(el)}
      onInput$={(_, el) => move(el, 'start')}
      {...props} />
    <div class="thumb start" data-value={min}></div>
  </>

});
export const ThumbEnd = component$((props: ThumbProps) => {
  useStylesScoped$(styles);
  const { endInput, min, max, change, focusRight, move} = useRangeContext();
  return <>
    <input 
      type="range" 
      ref={endInput}
      min={min}
      max={max}
      value={max}
      onChange$={() => change()}
      onFocus$={(_, el) => focusRight(el)}
      onInput$={(_, el) => move(el, 'end')}
      {...props} />
    <div class="thumb end" data-value={max}></div>
  </>
});