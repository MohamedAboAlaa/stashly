import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Group } from '../models/bookmark.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private http = inject(HttpClient);
  private readonly groupApiUrl = 'http://localhost:3001/groups';

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.groupApiUrl);
  }

  getGroupById(id: string | number): Observable<Group> {
    return this.http.get<Group>(`${this.groupApiUrl}/${id}`);
  }

  addGroup(newGroup: Omit<Group, 'id' | 'createdAt'>): Observable<Group> {
    const payload = {
      ...newGroup,
      createdAt: new Date().toISOString()
    }
    return this.http.post<Group>(this.groupApiUrl, payload);
  }

  removeGroup(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.groupApiUrl}/${id}`);
  }

  updateGroup(id: string | number, changes: Partial<Group>): Observable<Group> {
    return this.http.patch<Group>(`${this.groupApiUrl}/${id}`, changes);
  }
}
