import { animate, style, transition, trigger } from '@angular/animations';

export const slideInAnimation = trigger('slideInAnimation', [
  transition(':enter', [
    style({ position: 'absolute', left: '-100%', width: '100%' }),
    animate('300ms ease-out', style({ left: '0%' })),
  ]),
  transition(':leave', [
    style({ position: 'absolute', left: '0%', width: '100%' }),
    animate('200ms ease-out', style({ left: '100%', opacity: 0 })),
  ]),
]);

export const slideInAnimation2 = trigger('slideInAnimation2', [
  transition(':enter', [
    style({ position: 'absolute', left: '100%', width: '100%' }),
    animate('300ms ease-out', style({ left: '0%' })),
  ]),
  transition(':leave', [
    style({ position: 'absolute', left: '0%', width: '100%' }),
    animate('200ms ease-out', style({ left: '100%', opacity: 0 })),
  ]),
]);

export const slideInFromBottomAnimation = trigger('slideInFromBottomAnimation', [
  transition(':enter', [
    style({ position: 'absolute', top: '100%', width: '100%' }),
    animate('300ms ease-out', style({ top: '0%' })),
  ]),
  transition(':leave', [
    style({ position: 'absolute', top: '0%', width: '100%' }),
    animate('200ms ease-out', style({ top: '-100%', opacity: 0 })),
  ]),
]);

export const slideInFromTopAnimation = trigger('slideInFromTopAnimation', [
  transition(':enter', [
    style({ position: 'absolute', top: '-100%', width: '100%' }),
    animate('300ms ease-out', style({ top: '0%' })),
  ]),
  transition(':leave', [
    style({ position: 'absolute', top: '0%', width: '100%' }),
    animate('200ms ease-out', style({ top: '100%', opacity: 0 })),
  ]),
]);

export const fadeScaleAnimation = trigger('fadeScaleAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.8)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
  ]),
  transition(':leave', [
    animate('200ms ease-out', style({ opacity: 0, transform: 'scale(0.8)' })),
  ]),
]);

export const rotateAnimation = trigger('rotateAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'rotate(-90deg)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'rotate(0deg)' })),
  ]),
  transition(':leave', [
    animate('200ms ease-out', style({ opacity: 0, transform: 'rotate(90deg)' })),
  ]),
]);
