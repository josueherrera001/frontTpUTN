import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { map, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

export interface Category {
  id: string;
  name: string;
}

export interface Subcategory {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiURL}/categories`;

  public categories = signal<Category[]>([]);

  constructor() {
    this.loadCategories();
  }

  loadCategories() {
    this.http.get<Category[]>(this.endpoint)
      .pipe(
        map(cats => cats.map(c => ({ id: c.id, name: c.name }))),
        tap(cats => this.categories.set(cats))
      )
      .subscribe();
  }

  getAll() {
    return this.http.get<Category[]>(this.endpoint);
  }

  getSubcategories(categoryId: string) {
    return this.http.get<Subcategory[]>(`${this.endpoint}/${categoryId}/subcategories`);
  }
}
