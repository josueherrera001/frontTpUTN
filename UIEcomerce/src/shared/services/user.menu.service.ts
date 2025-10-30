// services/user.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Account } from 'shared/models/Account';
import { AccountWithMenus } from 'shared/models/Authmenues/accountWithMenus';
import { User } from 'shared/models/user';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserMenuService {

  // Signals
  // private usersSignal = signal<Account[]>([]);
   private usersSignal = signal<User[]>([]);
  private loadingSignal = signal<boolean>(false);
  private selectedUserSignal = signal<AccountWithMenus | null>(null);

  // Computed signals
  users = computed(() => this.usersSignal());
  loading = computed(() => this.loadingSignal());
  selectedUser = computed(() => this.selectedUserSignal());

    private readonly _http = inject(HttpClient);
    private readonly _endpoint = environment.apiURLlocal;

  constructor() {}

  // Cargar usuarios
  loadUsers(): void {
    this.loadingSignal.set(true);
    this._http.get<User[]>(`${this._endpoint}users`).subscribe({
      next: (users) => {
        this.usersSignal.set(users);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loadingSignal.set(false);
      }
    });
  }

  // Obtener usuario con menús
  getUserWithMenus(AccounrId: string): Observable<AccountWithMenus> {
    return this._http.get<AccountWithMenus>(`${this._endpoint}accountmenuitem/${AccounrId}/full`);
  }

  // Seleccionar usuario
  getAllAccount(): Observable<Account>{
     return this._http.get<Account>(`${this._endpoint}auth/allaccount`);
  }

  // Obtener roles
  // getRoles(): { value: UserRole; label: string }[] {
  //   return [
  //     { value: UserRole.SUPER_ADMIN, label: 'Super Admin' },
  //     { value: UserRole.ADMIN, label: 'Administrador' },
  //     { value: UserRole.USER, label: 'Usuario' },
  //     { value: UserRole.GUEST, label: 'Invitado' }
  //   ];
  // }

  // Obtener clase para badge de rol
  // getRoleBadgeClass(role: UserRole): string {
  //   const classes = {
  //     [UserRole.SUPER_ADMIN]: 'bg-purple-100 text-purple-800',
  //     [UserRole.ADMIN]: 'bg-red-100 text-red-800',
  //     [UserRole.USER]: 'bg-blue-100 text-blue-800',
  //     [UserRole.GUEST]: 'bg-gray-100 text-gray-800'
  //   };
  //   return classes[role];
  // }
}
