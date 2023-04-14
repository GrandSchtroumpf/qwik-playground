import { component$, useStylesScoped$, event$, useSignal } from "@builder.io/qwik";
import type { InputAttributes } from "../types";
import styles from './slider.scss?inline';

interface SliderProps extends Omit<InputAttributes, 'type' | 'children'> {}

export const Slider = component$((props: SliderProps) => {
  useStylesScoped$(styles);
  const value = props.value ?? 0;
  const min = props.min ? Number(props.min) : 0;
  const max = props.max ? Number(props.max) : 100;
  const step = props.step ? Number(props.step) : 1;

  const slider = useSignal<HTMLElement>();
  const move = event$((event: Event, input: HTMLInputElement) => {
    const percent = input.valueAsNumber / (max - min);
    const position = percent * (input.clientWidth - 16);
    slider.value?.style.setProperty('--position', `${position}px`);
    input.nextElementSibling?.setAttribute('data-value', `${Math.floor(input.valueAsNumber)}`);
  });
  return <div class="slider" ref={slider}>
    <div class="track"></div>
    <input type="range" {...props} value={value} step={step} min={min} max={max} onInput$={move}/>
    <div class="thumb" data-value={value ?? min}></div>
  </div>
});