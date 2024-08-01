import { Directive, EventEmitter, HostListener, Output, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCustomCaptcha]',
  standalone: true
})
export class CustomCaptchaDirective {
  @Output() captchaResolved = new EventEmitter<boolean>();

  private isResolved: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.applyStyles();
  }

  @HostListener('click')
  onClick() {
    this.isResolved = !this.isResolved;
    this.captchaResolved.emit(this.isResolved);
    this.updateStyles();
  }

  private applyStyles() {
    const button = this.el.nativeElement;
    this.renderer.setStyle(button, 'padding', '10px 20px');
    this.renderer.setStyle(button, 'background-color', '#007bff');
    this.renderer.setStyle(button, 'color', '#fff');
    this.renderer.setStyle(button, 'border', 'none');
    this.renderer.setStyle(button, 'border-radius', '5px');
    this.renderer.setStyle(button, 'cursor', 'pointer');
  }

  private updateStyles() {
    const button = this.el.nativeElement;
    this.renderer.setStyle(button, 'background-color', this.isResolved ? '#28a745' : '#007bff');
  }
}
