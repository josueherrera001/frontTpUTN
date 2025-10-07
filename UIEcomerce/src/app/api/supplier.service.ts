import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { tap } from 'rxjs';

export interface Supplier {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiURL}/suppliers`;

  public suppliers = signal<Supplier[]>([]);

  constructor() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.http.get<Supplier[]>(this.endpoint)
      .pipe(tap(sup => this.suppliers.set(sup)))
      .subscribe();
  }

  getAll() {
    return this.http.get<Supplier[]>(this.endpoint);
  }
}
