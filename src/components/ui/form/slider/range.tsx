import { Slot, component$, useStyles$, event$, useSignal, useVisibleTask$, createContextId, useContextProvider, useContext, $, useId } from "@builder.io/qwik";
import clsq from "~/components/utils/clsq";
import { useOnReset } from "../../utils";
import { useFormValue } from "../form";
import type { FieldsetAttributes, InputAttributes } from "../types";
import styles from './range.scss?inline';

interface RangeProps extends FieldsetAttributes {
  min?: number | string;
  max?: number | string;
  step?: number | string;
}

interface RangeValue {
  start: number | string;
  end: number | string;
}

const RangeContext = createContextId<RangeService>('RangeContext');
const useRangeContext = () => useContext(RangeContext);

type RangeService = ReturnType<typeof useRangeProvider>;

function useRangeProvider(props: RangeProps) {
  const slider = useSignal<HTMLFieldSetElement>();
  const track = useSignal<HTMLElement>();
  const startInput = useSignal<HTMLInputElement>();
  const endInput = useSignal<HTMLInputElement>();
  const baseName = props.name ?? useId();
  
  const min = props.min ? Number(props.min) : 0;
  const max = props.max ? Number(props.max) : 100;
  const step = props.step ? Number(props.step) : 1;

  /** Set the position of the thumb & track for the input */
  const setPosition = event$((input: HTMLInputElement, mode: 'start' | 'end') => {
    const percent = input.valueAsNumber / (max - min);
    // total width - inline padding - thumb size
    const distance = track.value!.clientWidth - 20;
    const position = mode === 'start' ? percent * distance : (percent - 1) * distance;
    slider.value!.style.setProperty(`--${mode}`, `${position}px`);
    input.nextElementSibling?.setAttribute('data-value', `${Math.floor(input.valueAsNumber)}`);
  });

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
  
  /** Resize input & set the new position */
  const move = event$((input: HTMLInputElement | undefined, mode: 'start' | 'end') => {
    if (!input) return;
    // If input have no focus yet, resize input
    if (document.activeElement !== input) {
      if (mode === 'start') focusLeft(input);
      if (mode === 'end') focusRight(input);
    }
    setPosition(input, mode);
  });

  const service = {
    baseName,
    slider,
    track,
    startInput,
    endInput,
    min,
    max,
    step,
    focusLeft,
    focusRight,
    resize,
    move,
    setPosition
  }
  useContextProvider(RangeContext, service);
  return service;
}

export const Range = component$((props: RangeProps) => {
  useStyles$(styles);
  const { min, max } = props;
  const { slider, track, setPosition } = useRangeProvider(props);
  const initialValue = useFormValue<RangeValue>(props.name);

  // Update UI on resize
  useVisibleTask$(() => {
    const obs = new ResizeObserver(() => {
      const inputs = slider.value?.querySelectorAll<HTMLInputElement>('input');
      setPosition(inputs!.item(0), 'start');
      setPosition(inputs!.item(1), 'end');
    });
    obs.observe(slider.value!);
    return () => obs.disconnect();
  });
  

  // Update position on reset
  useOnReset(slider, $(() => {
    requestAnimationFrame(() => {
      // Need to reset the value because of weird behavior with reset on SPA navigation
      const inputs = slider.value?.querySelectorAll<HTMLInputElement>('input');
      const start = inputs!.item(0);
      const end = inputs!.item(1);
      start.value = (initialValue?.start ?? min ?? 0).toString();
      end.value = (initialValue?.end ?? max ?? 100).toString();
      setPosition(inputs!.item(0), 'start');
      setPosition(inputs!.item(1), 'end');
    })
  }));

  return <fieldset {...props} class={clsq('range', props.class)} ref={slider}>
    <div class="track" ref={track}></div>
    <Slot/>
  </fieldset>
});

interface ThumbProps extends Omit<InputAttributes, 'type' | 'children' | 'step' | 'min' | 'max'> {}

export const ThumbStart = component$((props: ThumbProps) => {
  const { baseName, startInput, min, max, step, resize, focusLeft, move} = useRangeContext();
  const name = baseName + '.start';
  const initialValue = useFormValue<string | number>(name);
  const value = props.value ?? initialValue ?? min;
  return <>
    <input
      type="range" 
      name={name}
      ref={startInput}
      min={min}
      max={max}
      step={step}
      value={value}
      onFocus$={(_, el) => focusLeft(el)}
      onInput$={(_, el) => move(el, 'start')}
      onMouseUp$={resize}
      onTouchEnd$={resize}
      onTouchCancel$={resize}
      {...props} />
    <div class="thumb start" data-value={value}></div>
  </>

});
export const ThumbEnd = component$((props: ThumbProps) => {
  const { baseName, endInput, min, max, step, resize, focusRight, move} = useRangeContext();
  const name = baseName + '.end';
  const initialValue = useFormValue<string | number>(name);
  const value = props.value ?? initialValue ?? max;
  return <>
    <input 
      type="range" 
      name={name}
      ref={endInput}
      min={min}
      max={max}
      step={step}
      value={value}
      onFocus$={(_, el) => focusRight(el)}
      onInput$={(_, el) => move(el, 'end')}
      onMouseUp$={resize}
      onTouchEnd$={resize}
      onTouchCancel$={resize}
      {...props} />
    <div class="thumb end" data-value={value}></div>
  </>
});