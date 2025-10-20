// UIEcomerce/src/app/api/provinces.service.ts  
import { HttpClient } from "@angular/common/http";  
import { Injectable, inject, signal } from "@angular/core";  
import { environment } from "environments/environment";  
import { tap } from "rxjs";  
  
export interface Province {  
  Id: string;  
  CountryId: string;  
  Name: string;  
  Description?: string; 
}  
  
@Injectable({providedIn: 'root'})  
export class ProvincesService {  
    public provinces = signal<Province[]>([]);  
    private readonly _http = inject(HttpClient);  
    private readonly _endpoint = environment.apiURLlocal;  
  
    public getProvincesByCountry(countryId: string): void {  
        this._http.get<Province[]>(`${this._endpoint}provinces?countryId=${countryId}`)  
            .pipe(  
                tap((provinces: Province[]) => this.provinces.set(provinces))  
            )  
            .subscribe();  
    }  
}