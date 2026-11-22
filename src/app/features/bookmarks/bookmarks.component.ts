import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { BookmarkService } from '../../core/services/bookmark.service';
import { BusinessErrorService } from '../../core/services/business-error.service';
import {
  Bookmark,
  BookmarkStatus,
  Group,
  VisitStatus,
} from '../../core/models/bookmark.model';
import { BookmarkCardComponent } from './components/bookmark-card/bookmark-card.component';
import { BookmarkFormComponent } from './components/bookmark-form/bookmark-form.component';
import { GroupService } from '../../core/services/group.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bookmarks',
  imports: [BookmarkCardComponent, BookmarkFormComponent, FormsModule],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.scss',
})
export class BookmarksComponent implements OnInit {
  groupFilterSelect =
    viewChild<ElementRef<HTMLSelectElement>>('groupFilterSelect');

  constructor() {
    effect(() => {
      const targetId = String(this.fgroupId());
      const availableGroups = this.groups();
      const selectEl = this.groupFilterSelect()?.nativeElement;

      if (selectEl && availableGroups.length >= 0) {
        selectEl.value = targetId;
      }
    });
  }
  bookmarkService = inject(BookmarkService);
  groupService = inject(GroupService);
  private route = inject(ActivatedRoute);
  private businessError = inject(BusinessErrorService);

  fgroupId = signal<string | number | 'ALL'>('ALL');
  fstatus = signal<BookmarkStatus | 'ALL'>('ALL');
  fisVisited = signal<VisitStatus | 'ALL'>('ALL');
  fsearchWord = signal<string | null>(null);
  selectedBookmark = signal<Bookmark | null>(null);
  isDeleteModalOpen = signal<boolean>(false);
  isFormModalOpen = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  groups = signal<Group[]>([]);

  sortedBookmarks = computed(() => {
    const list = [...this.bookmarkService.bookmarks()];

    return list.sort((a, b) => {
      const ta = this.safeTime(a.createdAt);
      const tb = this.safeTime(b.createdAt);
      return tb - ta;
    });
  });

  filteredBookmarks = computed(() => {
    const groupId = this.fgroupId();
    const status = this.fstatus();
    const visitStatus = this.fisVisited();
    const search = this.fsearchWord()?.trim().toLowerCase();

    return this.sortedBookmarks().filter((bm) => {
      if (
        groupId !== 'ALL' &&
        groupId !== '' &&
        String(bm.groupId) !== String(groupId)
      ) {
        return false;
      }

      if (status !== 'ALL' && bm.status !== status) {
        return false;
      }

      if (visitStatus !== 'ALL' && bm.visitStatus !== visitStatus) {
        return false;
      }

      if (search) {
        const titleMatch = (bm.title ?? '').toLowerCase().includes(search);
        const urlMatch = (bm.url ?? '').toLowerCase().includes(search);
        if (!titleMatch && !urlMatch) {
          return false;
        }
      }

      return true;
    });
  });

  safeTime = (dateStr?: string) => {
    if (!dateStr) return 0;
    const t = new Date(dateStr).getTime();
    return Number.isNaN(t) ? 0 : t;
  };

  toStr(val: unknown): string {
    return String(val ?? '');
  }

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
    this.route.paramMap.subscribe((params) => {
      const routeGroupId = params.get('groupId');
      this.fgroupId.set(routeGroupId ? routeGroupId : 'ALL');
    });
  }

  openEditModal(bookmark: Bookmark) {
    this.selectedBookmark.set(bookmark);
    this.isFormModalOpen.set(true);
  }

  openDeleteModal(bookmark: Bookmark) {
    this.selectedBookmark.set(bookmark);
    this.isDeleteModalOpen.set(true);
  }

  openCreateModal() {
    this.selectedBookmark.set(null);
    this.isFormModalOpen.set(true);
  }

  closeFormModal() {
    this.selectedBookmark.set(null);
    this.isFormModalOpen.set(false);
  }
  closeDeleteModal() {
    this.selectedBookmark.set(null);
    this.isDeleteModalOpen.set(false);
  }

  handleVisit(bookmark: Bookmark) {
    if (bookmark && bookmark.id !== undefined) {
      const payload: Bookmark = {
        ...bookmark,
        visitStatus: 'VISITED',
      };
      this.bookmarkService.updateBookmark(bookmark?.id!, payload).subscribe({
        error: () => {
          this.businessError.show('Failed to update visit status.');
        },
      });
    }
  }

  finishBookmark(bookmark: Bookmark) {
    if (bookmark && bookmark.id !== undefined) {
      const payload: Bookmark = {
        ...bookmark,
        status: bookmark.status === 'FINISHED' ? 'PENDING' : 'FINISHED',
      };
      this.bookmarkService.updateBookmark(payload.id!, payload).subscribe({
        error: () => {
          this.businessError.show('Failed to update bookmark status.');
        },
      });
    }
  }

  editBookmark(changes: Bookmark) {
    const currentBookmark = this.selectedBookmark();
    if (currentBookmark && currentBookmark.id !== undefined) {
      const payload: Bookmark = {
        ...currentBookmark,
        ...changes,
        id: currentBookmark.id,
      };
      this.bookmarkService
        .updateBookmark(currentBookmark.id, payload)
        .subscribe({
          next: () => {
            this.closeFormModal();
          },
          error: () => {
            this.businessError.show('Failed to update bookmark.');
          },
        });
    }
  }

  deleteBookmark() {
    const currentBookmark = this.selectedBookmark();
    if (currentBookmark && currentBookmark.id !== undefined) {
      this.bookmarkService.removeBookmark(currentBookmark.id).subscribe({
        next: () => {
          this.closeDeleteModal();
        },
        error: () => {
          this.businessError.show('Failed to delete bookmark.');
        },
      });
    }
  }

  createBookmark(bookmark: Bookmark) {
    this.bookmarkService.addBookmark(bookmark).subscribe({
      next: () => {
        this.closeFormModal();
      },
      error: () => {
        this.businessError.show('Failed to add bookmark.');
      },
    });
  }

  async handleCopyLink(url: string) {
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      this.businessError.show('Could not copy link to clipboard.');
    }
  }

  resetFilters() {
    this.fgroupId.set('ALL');
    this.fsearchWord.set(null);
    this.fstatus.set('ALL');
    this.fisVisited.set('ALL');
  }
}
