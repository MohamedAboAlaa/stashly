import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { GroupService } from '../../core/services/group.service';
import { BookmarkService } from '../../core/services/bookmark.service';
import { Router } from '@angular/router';
import { BusinessErrorService } from '../../core/services/business-error.service';
import { Bookmark, Group } from '../../core/models/bookmark.model';
import { forkJoin, Observable, switchMap, tap, of } from 'rxjs';
import {
  ModalComponent,
  ModalMode,
} from '../../shared/components/modal/modal.component';
import { GroupFormComponent } from './components/group-form/group-form.component';
import { GroupCardComponent } from './components/group-card/group-card.component';

interface GroupStats {
  total: number;
  finished: number;
}

@Component({
  selector: 'app-groups',
  imports: [ModalComponent, GroupFormComponent, GroupCardComponent],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
})
export class GroupsComponent implements OnInit {
  groupService = inject(GroupService);
  bookmarkService = inject(BookmarkService);
  router = inject(Router);
  private businessError = inject(BusinessErrorService);

  rawGroups = signal<Group[]>([]);
  isLoading = signal<boolean>(true);
  modalMode = signal<ModalMode>('none');
  selectedGroup = signal<Group | null>(null);

  sortedGroups = computed(() => {
    return [...this.rawGroups()].sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
    );
  });

  groupStatsMap = computed(() => {
    const stats = new Map<string, GroupStats>();
    for (const bm of this.bookmarkService.bookmarks()) {
      const key = String(bm.groupId);
      if (key === undefined || key === null) continue;

      let current = stats.get(key) ?? { total: 0, finished: 0 };
      current.total++;
      if (bm.status === 'FINISHED') {
        current.finished++;
      }
      stats.set(key, current);
    }
    return stats;
  });

  statsFor(group: Group) {
    return group.id !== undefined
      ? this.groupStatsMap().get(String(group.id))
      : undefined;
  }

  ngOnInit(): void {
    this.bookmarkService.getBookmarks();
    this.loadGroups();
  }

  loadGroups() {
    this.isLoading.set(true);
    this.groupService.getGroups().subscribe({
      next: (groups) => {
        this.rawGroups.set(groups);
        this.isLoading.set(false);
      },
      error: () => {
        this.businessError.show('Error in fetching groups data!');
        this.isLoading.set(false);
      },
    });
  }

  openCreateModal() {
    this.selectedGroup.set(null);
    this.modalMode.set('form');
  }

  openEditModal(group: Group) {
    this.selectedGroup.set(group);
    this.modalMode.set('form');
  }

  openDeleteModal(group: Group) {
    this.selectedGroup.set(group);
    this.modalMode.set('delete');
  }

  closeModal() {
    this.modalMode.set('none');
    this.selectedGroup.set(null);
  }

  confirmDelete() {
    const group = this.selectedGroup();
    if (!group?.id) return;

    this.deleteGroup(group.id);
    this.closeModal();
  }

  saveNewGroup(groupData: Group) {
    const newGroupPayload: Group = {
      ...groupData,
    };
    this.groupService.addGroup(newGroupPayload).subscribe({
      next: (addedGroup) => {
        this.rawGroups.update((list) => [...list, addedGroup]);
        this.closeModal();
      },
      error: () => {
        this.businessError.show('Error in adding new group');
      },
    });
  }

  updateGroupData(groupData: Group) {
    const currentGroup = this.selectedGroup();
    if (currentGroup && currentGroup.id !== undefined) {
      const updatedGroupPayload: Group = {
        ...currentGroup,
        ...groupData,
        id: currentGroup.id,
      };
      this.groupService
        .updateGroup(currentGroup.id, updatedGroupPayload)
        .subscribe({
          next: (updatedGroup) => {
            this.rawGroups.update((list) =>
              list.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)),
            );
            this.closeModal();
          },
          error: () => {
            this.businessError.show(
              `Error in updating "${currentGroup.title}" Group`,
            );
          },
        });
    }
  }

  deleteGroup(groupId: string | number) {
    const targetGroup = this.rawGroups().find(
      (g) => String(g.id) === String(groupId),
    );
    if (targetGroup && targetGroup.title.trim().toLowerCase() === 'general') {
      this.businessError.show('The "General" group cannot be deleted.');
      return;
    }

    this.ensureGeneralGroup()
      .pipe(
        switchMap((generalGroup) =>
          this.groupService.removeGroup(groupId).pipe(
            switchMap(() => {
              const affectedBookmarks = this.bookmarkService
                .bookmarks()
                .filter(
                  (bm) =>
                    String(bm.groupId) === String(groupId) &&
                    bm.id !== undefined,
                );

              if (
                affectedBookmarks.length === 0 ||
                generalGroup.id === undefined
              ) {
                return of([]);
              }

              const updateCalls = affectedBookmarks.map((bm) =>
                this.bookmarkService.updateBookmark(bm.id!, {
                  ...bm,
                  groupId: generalGroup.id!,
                }),
              );

              return forkJoin(updateCalls);
            }),
          ),
        ),
      )
      .subscribe({
        next: (updatedBookmarks) => {
          this.rawGroups.update((list) =>
            list.filter((g) => String(g.id) !== String(groupId)),
          );

          if (updatedBookmarks.length > 0) {
            this.bookmarkService.syncUpdatedBookmarks(updatedBookmarks);
          }
        },
        error: () => {
          this.businessError.show(
            'Error in deleting group or reassigning bookmarks!',
          );
        },
      });
  }

  openGroup(groupId: string | number) {
    this.router.navigate(['/groups', groupId, 'bookmarks']);
  }

  handleModalSave(formValue: Partial<Group>) {
    const payload: Group = {
      title: formValue.title ?? '',
      description: formValue.description ?? '',
    };

    if (this.selectedGroup()) {
      this.updateGroupData(payload);
    } else {
      this.saveNewGroup(payload);
    }
  }

  private ensureGeneralGroup(): Observable<Group> {
    const existing = this.rawGroups().find(
      (g) => g.title.trim().toLowerCase() === 'general',
    );

    if (existing && existing.id !== undefined) {
      return of(existing);
    }

    return this.groupService
      .addGroup({
        title: 'General',
        description: 'Default group for uncategorized or reassigned bookmarks.',
      })
      .pipe(
        tap((created: Group) => {
          this.rawGroups.update((list) => [...list, created]);
        }),
      );
  }
}
