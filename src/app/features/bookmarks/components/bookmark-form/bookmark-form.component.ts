import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Bookmark, BookmarkStatus, Group, VisitStatus } from '../../../../core/models/bookmark.model';

@Component({
  selector: 'app-bookmark-form',
  imports: [ReactiveFormsModule],
  templateUrl: './bookmark-form.component.html',
  styleUrl: './bookmark-form.component.scss',
})
export class BookmarkFormComponent {
  private fb = inject(FormBuilder);

  bookmark = input<Bookmark | null>(null);
  groups = input<Group[]>([]);

  saveCreate = output<Omit<Bookmark, 'id' | 'createdAt'>>();
  saveEdit = output<Bookmark>();
  cancel = output<void>();

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    url: [
      '',
      [
        Validators.required,
        Validators.pattern(/^https?:\/\/.+/i),
      ],
    ],
    groupId: ['' as string | number, [Validators.required]],
    status: ['PENDING' as BookmarkStatus, [Validators.required]],
    visitStatus: ['UNVISITED' as VisitStatus, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.bookmark();
      const availableGroups = this.groups();

      if (current) {
        this.form.reset({
          title: current.title ?? '',
          url: current.url ?? '',
          groupId: current.groupId ?? availableGroups[0]?.id ?? '',
          status: current.status ?? 'PENDING',
          visitStatus: current.visitStatus ?? 'UNVISITED',
        });
      } else {
        this.form.reset({
          title: '',
          url: '',
          groupId: availableGroups[0]?.id ?? '',
          status: 'PENDING',
          visitStatus: 'UNVISITED',
        });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const cleanedTitle = raw.title.trim();
    const cleanedUrl = raw.url.trim();

    if (!cleanedTitle || !cleanedUrl) {
      this.form.markAllAsTouched();
      return;
    }

    const current = this.bookmark();

    if (current) {
      const updatedBookmark: Bookmark = {
        ...current,
        title: cleanedTitle,
        url: cleanedUrl,
        groupId: raw.groupId,
        status: raw.status,
        visitStatus: raw.visitStatus,
      };
      this.saveEdit.emit(updatedBookmark);
    } else {
      const newBookmark: Omit<Bookmark, 'id' | 'createdAt'> = {
        title: cleanedTitle,
        url: cleanedUrl,
        groupId: raw.groupId,
        status: raw.status,
        visitStatus: raw.visitStatus,
      };
      this.saveCreate.emit(newBookmark);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  hasError(controlName: 'title' | 'url' | 'groupId', errorName: string): boolean {
    const control = this.form.controls[controlName];
    return control.touched && control.hasError(errorName);
  }
}