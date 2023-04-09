import { component$, useStylesScoped$, event$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { InputAttributes } from "../types";
import styles from './slider.scss?inline';

interface RangeProps extends Omit<InputAttributes, 'type' | 'children'> {}

export const Range = component$((props: RangeProps) => {
  useStylesScoped$(styles);
  const leftInput = useSignal<HTMLInputElement>();
  const rightInput = useSignal<HTMLInputElement>();
  const slider = useSignal<HTMLElement>();
  
  const min = props.min ? Number(props.min) : 0;
  const max = props.max ? Number(props.max) : 100;

  useVisibleTask$(() => {
    const root = slider.value;
    if (root) {
      slider.value!.style.setProperty('--left', `${min / (max - min) * root.clientWidth}px`);
      slider.value!.style.setProperty('--right', `${max / (max - min) * root.clientWidth}px`);
    }
  })


  const focusLeft = event$((left: HTMLInputElement) => {
    const right = rightInput.value!;
    const percent = right.valueAsNumber / (max - min) * 100;
    left.max = right.value;
    left.style.setProperty('width', `${percent}%`);
    right.style.setProperty('width', `${100 - percent}%`);
  });
  const focusRight = event$((right: HTMLInputElement) => {
    const left = leftInput.value!;
    const percent = left.valueAsNumber / (max - min) * 100;
    right.min = left.value;
    left.style.setProperty('width', `${percent}%`);
    right.style.setProperty('width', `${100 - percent}%`);
  });

  const change = event$(() => {
    const right = rightInput.value!;
    const left = leftInput.value!;
    const middle = left.valueAsNumber + (right.valueAsNumber - left.valueAsNumber) / 2;
    const percent = middle / (max - min) * 100;
    left.style.setProperty('width', `${percent}%`);
    right.style.setProperty('width', `${100 - percent}%`);
    right.min = left.max = middle.toString();
  });

  const move = event$((input: HTMLInputElement, mode: 'left' | 'right') => {
    console.log('Move', input.valueAsNumber);
    if (document.activeElement !== input) return; // Wait for element to have focus (change width)
    const root = slider.value!;
    const percent = input.valueAsNumber / (max - min);
    const position = percent * root.clientWidth;
    slider.value!.style.setProperty(`--${mode}`, `${position}px`);
  });

  return <div class="range" ref={slider}>
    <div class="track"></div>
    <div class="thumb left"></div>
    <div class="thumb right"></div>
    <div class="sliders">
      <input class="left" 
        type="range" 
        ref={leftInput}
        min={min}
        max={max}
        value={min}
        onChange$={() => change()}
        onFocus$={(_, el) => focusLeft(el)}
        onInput$={(_, el) => move(el, 'left')}
        {...props} />
      <input class="right" 
        type="range" 
        ref={rightInput}
        min={min}
        max={max}
        value={max}
        onChange$={() => change()}
        onFocus$={(_, el) => focusRight(el)}
        onInput$={(_, el) => move(el, 'right')}
        {...props} />
    </div>

  </div>
});