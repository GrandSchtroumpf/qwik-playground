import { component$, useStylesScoped$, event$, useSignal } from "@builder.io/qwik";
// import type { Event } from "@builder.io/qwik";
import type { InputAttributes } from "../types";
import styles from './slider.scss?inline';

interface SliderProps extends Omit<InputAttributes, 'type' | 'children'> {}

export const Slider = component$((props: SliderProps) => {
  useStylesScoped$(styles);
  const value = props.value ?? 0;
  const min = props.min ? Number(props.min) : 0;
  const max = props.max ? Number(props.max) : 100;

  const slider = useSignal<HTMLElement>();
  const move = event$((event: Event, input: HTMLInputElement) => {
    const value = input.valueAsNumber;
    const position = (value - min) / (max - min) * input.clientWidth;
    slider.value?.style.setProperty('--position', `${position}px`);
  });
  return <div class="slider" ref={slider}>
    <input type="range" {...props} value={value} min={min} max={max} onInput$={move}/>
    <div class="track"></div>
    <div class="thumb"></div>
  </div>
});