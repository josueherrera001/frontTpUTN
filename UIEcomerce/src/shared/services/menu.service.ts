import { inject, Injectable, signal } from '@angular/core';
import { Menu } from '../models/menu';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.development';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public menus = signal<Menu[]>([]);
  private readonly _http = inject(HttpClient);
  private readonly _endpoint = environment.apiURLlocal + 'menus';

  constructor() {
    this.getMenus();
   }

  public getMenus(): void {
    debugger;
    this._http
      .get<Menu[]>(`${this._endpoint}`)
      .pipe(
        map((menus: Menu[]) =>
          menus.map((menu: Menu) => ({ ...menu }))
        ),
        tap((Menus: Menu[]) => {
          debugger;
          this.menus.set(Menus);
        })
      )
      .subscribe();
  }
}
