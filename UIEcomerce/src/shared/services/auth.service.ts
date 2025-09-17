import { inject, Injectable, signal } from '@angular/core';
import { Menu } from '../models/menu';
import { HttpClient } from '@angular/common/http';
import { TaskService } from './task.service';
import { JwtHelperService } from '@auth0/angular-jwt';

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
    debugger;
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
      debugger;
      return !this.statetoke;
     } catch (error) {
      return false;
     }
    }
}
