import { Directive, ElementRef, HostListener, inject, input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  tooltipText = input<string>('', { alias: 'appTooltip' });

  private tooltipElement: HTMLElement | null = null;

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltipText()) return;

    this.tooltipElement = this.renderer.createElement('span');
    const text = this.renderer.createText(this.tooltipText());
    this.renderer.appendChild(this.tooltipElement, text);

    this.renderer.addClass(this.tooltipElement, 'custom-tooltip-box');

    this.renderer.appendChild(this.el.nativeElement, this.tooltipElement);
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltipElement) {
      this.renderer.removeChild(this.el.nativeElement, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
