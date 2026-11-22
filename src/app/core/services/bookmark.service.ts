import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Bookmark } from '../models/bookmark.model';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  private http = inject(HttpClient);
  private readonly bookmarkApiUrl = 'http://localhost:3001/bookmarks';

  private _bookmarks = signal<Bookmark[]>([]);
  readonly bookmarks = this._bookmarks.asReadonly();

  private _isLoaded = signal<boolean>(false);
  readonly isLoaded = this._isLoaded.asReadonly();

  getBookmarks(forceRefresh = false) {
    if (this._isLoaded() && !forceRefresh) {
      return;
    }

    this.http.get<Bookmark[]>(this.bookmarkApiUrl).subscribe({
      next: (data) => {
        this._bookmarks.set(data);
        this._isLoaded.set(true);
      },
      error: (err) => {
        console.error('Failed to load bookmarks:', err);
      },
    });
  }

  addBookmark(newBookmark: Omit<Bookmark, 'id' | 'createdAt'>) {
    const payload = {
      ...newBookmark,
      createdAt: new Date().toISOString(),
    };
    return this.http.post<Bookmark>(this.bookmarkApiUrl, payload).pipe(
      tap((created) => {
        this._bookmarks.update((list) => [...list, created]);
      }),
    );
  }

  removeBookmark(id: string | number) {
    return this.http.delete<void>(`${this.bookmarkApiUrl}/${id}`).pipe(
      tap(() => {
        this._bookmarks.update((list) => list.filter((bk) => bk.id !== id));
      }),
    );
  }

  updateBookmark(id: string | number, changes: Partial<Bookmark>) {
    return this.http
      .patch<Bookmark>(`${this.bookmarkApiUrl}/${id}`, changes)
      .pipe(
        tap((updated) => {
          this._bookmarks.update((list) =>
            list.map((bk) => (bk.id === updated.id ? updated : bk)),
          );
        }),
      );
  }

  syncUpdatedBookmarks(updatedBookmarks: Bookmark[]) {
    if (updatedBookmarks.length === 0) return;

    const updatedMap = new Map(updatedBookmarks.map((b) => [String(b.id), b]));

    this._bookmarks.update((list) =>
      list.map((bm) => updatedMap.get(String(bm.id)) ?? bm),
    );
  }
}
