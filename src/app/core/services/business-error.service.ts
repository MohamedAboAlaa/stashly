import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class BusinessErrorService {
  message = signal<string | null>(null);

  show(msg: string): void {
    this.message.set(msg);
  }

  close(): void {
    this.message.set(null);
  }
}
