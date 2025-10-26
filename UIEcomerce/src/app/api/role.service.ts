import { HttpClient } from "@angular/common/http";  
import { Injectable, inject, signal } from "@angular/core";  
import { environment } from "environments/environment";  
import { tap } from "rxjs";  
import { Role } from "shared/models/role.interface";  
  
@Injectable({providedIn: 'root'})  
export class RolesService {  
    public roles = signal<Role[]>([]);  
    private readonly _http = inject(HttpClient);  
    private readonly _endpoint = environment.apiURLlocal;  
  
    constructor() {  
        this.getRoles();  
    }  
  
    // GET ROLES LIST  
    public getRoles(): void {  
        this._http.get<Role[]>(`${this._endpoint}roles`)  
            .pipe(  
                tap((roles: Role[]) => this.roles.set(roles))  
            )  
            .subscribe();  
    }  
  
    // GET ROLE BY ID  
    public getRoleById(id: string) {  
        return this._http.get<Role>(`${this._endpoint}roles/${id}`);  
    }  
}