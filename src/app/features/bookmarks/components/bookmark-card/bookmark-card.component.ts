import { Component, computed, input, output, signal } from '@angular/core';
import { Bookmark } from '../../../../core/models/bookmark.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bookmark-card',
  imports: [DatePipe],
  templateUrl: './bookmark-card.component.html',
  styleUrl: './bookmark-card.component.scss'
})
export class BookmarkCardComponent {
  bookmark = input.required<Bookmark>();
  visit = output<Bookmark>();
  toggleFinish = output<Bookmark>();
  copyLink = output<string>();
  edit = output<Bookmark>();
  delete = output<Bookmark>();
  copied = signal(false);

  isFinished = computed(() => this.bookmark().status === 'FINISHED');
  isVisited = computed(() => this.bookmark().visitStatus === 'VISITED');

  onOpenLink(event: Event) {
    event.preventDefault();
    const bm = this.bookmark();
    this.visit.emit(bm);

    if (bm.url) {
      window.open(bm.url, '_blank', 'noopener,noreferrer');
    }
  }

  onToggleFinish(event: Event) {
    event.stopPropagation();
    this.toggleFinish.emit(this.bookmark());
  }

  onCopyLink(event: Event) {
    event.stopPropagation();
    const url = this.bookmark().url;
    if (!url) return;

    this.copyLink.emit(url);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }

  onEdit(event: Event) {
    event.stopPropagation();
    this.edit.emit(this.bookmark());
  }

  onDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.bookmark());
  }
}
