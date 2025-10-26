import { HttpClient } from "@angular/common/http";  
import { Injectable, inject, signal } from "@angular/core";  
import { environment } from "environments/environment";  
import { tap } from "rxjs";  
import { User } from "shared/models/user";  
  
@Injectable({providedIn: 'root'})  
export class UsersService {  
    public users = signal<User[]>([]);  
    private readonly _http = inject(HttpClient);  
    private readonly _endpoint = environment.apiURLlocal;  
  
    constructor() {  
        this.getUsers();  
    }  
  
    // GET USERS LIST  
    public getUsers(): void {  
        this._http.get<User[]>(`${this._endpoint}users`)  
            .pipe(  
                tap((users: User[]) => this.users.set(users))  
            )  
            .subscribe();  
    }  
  
    // GET USER BY ID  
    public getUserById(id: string) {  
        return this._http.get<User>(`${this._endpoint}users/${id}`);  
    }  
  
    // POST: create USER  
    public createUser(user: any) {  
        return this._http.post<User>(`${this._endpoint}users`, user);  
    }  
  
    // PUT: update USER  
    public updateUser(id: string, user: any) {  
        return this._http.put<User>(`${this._endpoint}users/${id}`, user);  
    }  
  
    // DELETE: delete USER  
    public deleteUser(id: string) {  
        return this._http.delete(`${this._endpoint}users/${id}`);  
    }  
}