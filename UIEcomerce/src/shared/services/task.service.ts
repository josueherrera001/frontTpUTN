import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment.development';
import { catchError, map, mapTo, Observable, of, tap } from 'rxjs';
import { Auth } from 'shared/models/auth';
import { Tokens } from 'shared/models/token';
import { DecoderTokenService } from './decoder.token.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly _http = inject(HttpClient);
  private readonly _endpoint = environment.apiURLlocal + 'auth';

    private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly RoleUser = 'RoleUser';
  private readonly ROLE = 'ROLE';

  private email:any;
  private readonly auth!: Auth;
  private loggedUser!: string;

  constructor() {
   }

  Authentication(modal: Auth): Observable<boolean>{
    this.doLogoutUser();
    this.email = modal.UserName;
      debugger;
    return this._http.post<any>(`${ this._endpoint }`, modal)
    .pipe(
      tap( tokens => {
        debugger;
        this.doLoginUser(modal.UserName, tokens.token)
      }),
      mapTo(true),
      catchError(error => {
      debugger;
        return of(false)
      })
    );
  }

  logout(): Observable<boolean>{
    this.auth.UserName = this.getJwtToken()!;
    const url = `${ this._endpoint }/logout`;

     let headers = new HttpHeaders()
          .set('cleantoken', this.getJwtToken()!)
          .set('Content-Type', 'application/json');

    return this._http.post<any>(url, null, { headers }).pipe(
      tap(() => this.doLogoutUser()),
      mapTo(true),
      catchError(error => {
        this.doLogoutUser()
        return of(true)
      }));
  }
  refreshToken(): Observable<boolean>{

    const url = `${ this._endpoint }/Refresh`;

     let headers = new HttpHeaders()
          .set('refreshToken', this.getRefreshToken()!)
          .set('Content-Type', 'application/json');

    return this._http.post<any>(url, null, { headers })
    .pipe(
      tap( tokens => this.storeJwtToken(tokens)),
      mapTo(true),
      catchError(error => {
        return of(false)
      })
    );
  }

  loggedIn() {
    return !!this.getJwtToken();
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem(this.RoleUser);
  }
  doLoginUser(username: string, tokens: string) {
    this.loggedUser = username;
    const tokensObj: Tokens = DecoderTokenService.decodeToken(tokens);
    tokensObj.jwt = tokens;
    this.email = username;
    this.storeTokens(tokensObj);
  }

  public doLogoutUser() {
    this.loggedUser = '';
    this.removeTokens();
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.jwt);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
    localStorage.setItem(this.ROLE, tokens.role);
  }

}
