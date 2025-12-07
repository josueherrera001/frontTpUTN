import { HttpClient } from "@angular/common/http";  
import { Injectable, inject, signal } from "@angular/core";  
import { environment } from "environments/environment";  
import { tap } from "rxjs";  
import { map } from 'rxjs';
import { Address } from "shared/models/address";
import { User } from "shared/models/user-list";  
  
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
    return this._http.get<User>(`${this._endpoint}users/${id}`).pipe(  
        map((user: User) => {   
        if (user.Addresses) {  
            user.Addresses = user.Addresses.map((address: any) => ({  
            ...address,  
            StreetNumber: address.Number,    
            BetweenStreet: address.Between   
            }));  
        }  
        return user;  
        })  
    );  
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
     // POST: create ADDRESS    
    public addAddress(address: Address) {    
        return this._http.post<Address>(`${this._endpoint}addresses`, address);    
    }    
  
    // PUT: update ADDRESS    
    public updateAddress(id: string, address: Partial<Address>) {    
        return this._http.put<Address>(`${this._endpoint}addresses/${id}`, address);    
    }    
  
    // DELETE: delete ADDRESS    
    public deleteAddress(id: string) {    
        return this._http.delete(`${this._endpoint}addresses/${id}`);    
    }    
  
    // GET ADDRESSES BY USER ID    
    public getAddressesByUserId(userId: string) {    
        return this._http.get<Address[]>(`${this._endpoint}addresses/user/${userId}`);    
    }    
}