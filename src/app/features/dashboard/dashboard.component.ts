import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookmarkService } from '../../core/services/bookmark.service';
import { GroupService } from '../../core/services/group.service';
import { BusinessErrorService } from '../../core/services/business-error.service';
import { Bookmark, Group } from '../../core/models/bookmark.model';
import { BookmarkFormComponent } from '../bookmarks/components/bookmark-form/bookmark-form.component';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, BookmarkFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  bookmarkService = inject(BookmarkService);
  private groupService = inject(GroupService);
  private businessError = inject(BusinessErrorService);

  groups = signal<Group[]>([]);
  isFormModalOpen = signal<boolean>(false);

  private readonly sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  ngOnInit(): void {
    this.bookmarkService.getBookmarks();

    this.groupService.getGroups().subscribe({
      next: (fetchedGroups) => {
        this.groups.set(fetchedGroups);
      },
      error: () => {
        this.businessError.show('Failed to load groups.');
      },
    });
  }

  private isWithinLastDays(dateStr?: string, days = 7): boolean {
    if (!dateStr) return false;
    const timestamp = new Date(dateStr).getTime();
    if (Number.isNaN(timestamp)) return false;

    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return timestamp >= cutoff && timestamp <= Date.now() + 60_000;
  }

  totalBookmarks = computed(() => this.bookmarkService.bookmarks().length);

  finishedBookmarks = computed(
    () =>
      this.bookmarkService.bookmarks().filter((b) => b.status === 'FINISHED')
        .length,
  );

  pendingBookmarks = computed(
    () =>
      this.bookmarkService.bookmarks().filter((b) => b.status !== 'FINISHED')
        .length,
  );

  savedThisWeek = computed(
    () =>
      this.bookmarkService
        .bookmarks()
        .filter((b) => this.isWithinLastDays(b.createdAt, 7)).length,
  );

  visitedThisWeek = computed(
    () =>
      this.bookmarkService
        .bookmarks()
        .filter(
          (b) =>
            b.visitStatus === 'VISITED' &&
            this.isWithinLastDays(b.createdAt, 7),
        ).length,
  );

  totalGroups = computed(() => this.groups().length);

  openCreateModal() {
    this.isFormModalOpen.set(true);
  }

  closeFormModal() {
    this.isFormModalOpen.set(false);
  }

  createBookmark(newBookmark: Omit<Bookmark, 'id' | 'createdAt'>) {
    this.bookmarkService.addBookmark(newBookmark).subscribe({
      next: () => {
        this.closeFormModal();
      },
      error: () => {
        this.businessError.show('Failed to add bookmark.');
      },
    });
  }
}
