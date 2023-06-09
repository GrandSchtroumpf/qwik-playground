import { component$, useStyles$, event$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import clsq from "~/components/utils/clsq";
import type { InputAttributes } from "../types";
import styles from './slider.scss?inline';

interface SliderProps extends Omit<InputAttributes, 'type' | 'children'> {
  position?: 'start' | 'end';
}

export const Slider = component$((props: SliderProps) => {
  useStyles$(styles);
  const slider = useSignal<HTMLElement>();
  const min = props.min ? Number(props.min) : 0;
  const max = props.max ? Number(props.max) : 100;
  const step = props.step ? Number(props.step) : 1;

  useVisibleTask$(() => {
    const input = slider.value?.querySelector<HTMLInputElement>('input');
    if (!input?.form) return;
    const handler = () => requestAnimationFrame(() => move(null, input));
    input.form.addEventListener('reset', handler);
    return () => input?.form?.removeEventListener('reset', handler);
  });

  const move = event$((event: any, input: HTMLInputElement) => {
    const percent = input.valueAsNumber / (max - min);
    const position = percent * (input.clientWidth - 16);
    slider.value?.style.setProperty('--position', `${position}px`);
    input.nextElementSibling?.setAttribute('data-value', `${Math.floor(input.valueAsNumber)}`);
  });

  return <div class={clsq('slider', props.position)} ref={slider}>
    <div class="track"></div>
    <input type="range" {...props} step={step} min={min} max={max} onInput$={move}/>
    <div class="thumb" data-value={props.value ?? min ?? 0}></div>
  </div>
});