import { Component, input, output, signal } from '@angular/core';

export type ModalMode = 'none' | 'form' | 'delete';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  host: {
    '(document:keydown.escape)': 'onEscapeKey($event)',
  },
})
export class ModalComponent {
  onEscapeKey(event: Event) {
    if (!this.isOpen()) return;
    event.preventDefault();
    this.closeModal();
  }
  isOpen = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  close = output<void>();

  closeModal() {
    this.close.emit();
  }

  onBackdropClick() {
    this.closeModal();
  }
}
