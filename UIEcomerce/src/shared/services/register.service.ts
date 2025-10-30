import { EnvironmentInjector, inject, Injectable, runInInjectionContext, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environment.development';
import { catchError, map, mapTo, Observable, of, tap, throwError } from 'rxjs';
import { User } from 'shared/models/user';
import { Auth } from 'shared/models/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  public users = signal<User[]>([]);
  private readonly _http = inject(HttpClient);
  private readonly _endpoint = environment.apiURLlocal + 'users';
      private readonly _injector = inject(EnvironmentInjector);

  constructor(public auth: TaskService) {
   }

    public gets(): void{
      this._http.get<User[]>(`${ this._endpoint}abouts`)
          .pipe(
              map( (users: User[]) => users.map((user:User)=>({ ...user }))),
              tap(( users: User[]) => this.users.set(users)))
          .subscribe();
    }

    public getById(id: number) {
        return runInInjectionContext( this._injector, () =>
            toSignal<User>(this._http.get<User>(`${ this._endpoint}/products/${id}`))
        );
    }

    public post(model:User): Observable<Auth> {
      return this._http
        .post<Auth>(`${this._endpoint}`, model)
        .pipe(
          tap((data: Auth) => {
            this.auth.doLogoutUser();
            this.auth.doLoginUser(data.UserName, data.token)
          }),
          map((data: Auth) => {
            return data
          }),
          catchError((error: HttpErrorResponse) => {
             return of(error as any);
          })
        );
    }

    put(modal: User): Observable<boolean>{
          return this._http.put<any>(`${ this._endpoint }/${ modal.Id }`, modal)
          .pipe(
            tap( data => data),
            mapTo(true),
            catchError(error => {
              throw of(false)
            })
          );
        }

      delete(id: string): Observable<boolean>{
          return this._http.delete<any>(`${ this._endpoint }/${ id }`)
          .pipe(
            tap( data => data),
            mapTo(true),
            catchError(error => {
              return of(false)
            })
          );
        }
  }
