import { Directive, effect, ElementRef, inject, input, OnInit, Renderer2, signal } from '@angular/core';

@Directive({
  selector: '[appVisited]'
})
export class VisitedDirective {
  private el = inject(ElementRef);
  private render = inject(Renderer2);

  isVisited = input<boolean>(false, { alias: 'appVisited' });

  cEffects = effect(() => {
    if (this.isVisited()) {
      this.render.addClass(this.el.nativeElement, 'visited-item');
    } else {
      this.render.removeClass(this.el.nativeElement, 'visited-item');
    }
  });
}
