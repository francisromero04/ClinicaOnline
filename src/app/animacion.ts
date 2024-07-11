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

export const fadeInOutAnimation = trigger('fadeInOutAnimation', [
  transition(':enter', [
    style({ opacity: 0 }), // Start with transparency
    animate('300ms ease-out', style({ opacity: 1 })), // Fade in
  ]),
  transition(':leave', [
    animate('200ms ease-out', style({ opacity: 0 })), // Fade out
  ]),
]);
