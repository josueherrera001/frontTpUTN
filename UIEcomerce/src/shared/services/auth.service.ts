import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskService } from './task.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Menu } from 'shared/models/Authmenues/menu';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  public menus = signal<Menu[]>([]);
  private readonly _http = inject(HttpClient);
  private readonly jwtHelper = inject(JwtHelperService);
  private statetoke:any;

  constructor(
      public auth: TaskService,
  ) { }

  public isAuthenticated(): boolean {
     try {
       let exp =this.jwtHelper.isTokenExpired(this.auth.getJwtToken());
      this.auth.refreshToken();
      if(this.auth.getJwtToken()!= null && exp){
        this.auth.refreshToken();
        this.statetoke = this.jwtHelper.isTokenExpired(this.auth.getJwtToken());
      }
      else{
        this.statetoke = exp;
      }
      return !this.statetoke;
     } catch (error) {
      return false;
     }
  }

  hasAnyRole(roles: string[]): boolean {
    debugger;
    // const userRoles = JSON.parse(localStorage.getItem('ROLE') || '[]') as Array<string>;
    // const hasRole = userRoles.some(role => roles.includes(role));
     const userRoles = localStorage.getItem('ROLE');
     let role:string ="";
     if ( userRoles != undefined)
       role = userRoles.toString();
    // const hasRole = roles.includes(role);
    return roles.includes(role);
  }
}
