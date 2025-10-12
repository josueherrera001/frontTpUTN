import { HttpClient } from "@angular/common/http";  
import { EnvironmentInjector, Injectable, inject, runInInjectionContext, signal } from "@angular/core";  
import { environment } from "environments/environment";  
import { tap } from "rxjs";  
import { Supplier } from "shared/models/supplier.interface";  
import { toSignal } from '@angular/core/rxjs-interop';  
  
@Injectable({providedIn: 'root'})  
export class SuppliersService {  
    public suppliers = signal<Supplier[]>([]);  
    private readonly _http = inject(HttpClient);  
    private readonly _endpoint = environment.apiURL;  
    private readonly _injector = inject(EnvironmentInjector);  
  
    constructor() {  
        this.getSuppliers();  
    }  
  
    // GET SUPPLIERS LIST  
    public getSuppliers(): void {  
        this._http.get<Supplier[]>(`${this._endpoint}/suppliers`)  
            .pipe(  
                tap((suppliers: Supplier[]) => this.suppliers.set(suppliers))  
            )  
            .subscribe();  
    }  
  
    // GET SUPPLIER BY ID  
    public getSupplierById(id: string) {  
        return runInInjectionContext(this._injector, () =>  
            toSignal<Supplier>(this._http.get<Supplier>(`${this._endpoint}/suppliers/${id}`))  
        );  
    }  
  
    // POST: create SUPPLIER  
    public createSupplier(supplier: Omit<Supplier, "id">) {  
        return this._http.post<Supplier>(`${this._endpoint}/suppliers`, supplier).pipe(  
            tap((newSupplier) => {  
                this.suppliers.update(suppliers => [...suppliers, newSupplier]);  
            })  
        );  
    }  
  
    // PUT: update SUPPLIER  
    public updateSupplier(id: string, supplier: Partial<Supplier>) {  
        return this._http.put<Supplier>(`${this._endpoint}/suppliers/${id}`, supplier).pipe(  
            tap((updated) => {  
                this.suppliers.update(suppliers =>  
                    suppliers.map(s => s.Id === id ? updated : s)  
                );  
            })  
        );  
    }  
  
    // DELETE: delete SUPPLIER  
    public deleteSupplier(id: string) {  
        return this._http.delete(`${this._endpoint}/suppliers/${id}`).pipe(  
            tap(() => {  
                this.suppliers.update(suppliers => suppliers.filter(s => s.Id !== id));  
            })  
        );  
    }  
}