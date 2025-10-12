import { HttpClient } from "@angular/common/http";  
import { EnvironmentInjector, Injectable, inject, runInInjectionContext, signal } from "@angular/core";  
import { environment } from "environments/environment";  
import { tap } from "rxjs";  
import { Lot } from "shared/models/lot.interface";  
import { toSignal } from '@angular/core/rxjs-interop';  
  
@Injectable({providedIn: 'root'})  
export class LotsService {  
    public lots = signal<Lot[]>([]);  
    private readonly _http = inject(HttpClient);  
    private readonly _endpoint = environment.apiURL;  
    private readonly _injector = inject(EnvironmentInjector);  
  
    constructor() {  
        this.getLots();  
    }  
  
    // GET LOTS LIST  
    public getLots(): void {  
        this._http.get<Lot[]>(`${this._endpoint}/lots`)  
            .pipe(  
                tap((lots: Lot[]) => this.lots.set(lots))  
            )  
            .subscribe();  
    }  
  
    // GET LOT BY ID  
    public getLotById(id: string) {  
        return runInInjectionContext(this._injector, () =>  
            toSignal<Lot>(this._http.get<Lot>(`${this._endpoint}/lots/${id}`))  
        );  
    }  
  
    // POST: create LOT  
    public createLot(lot: Omit<Lot, "id">) {  
        return this._http.post<Lot>(`${this._endpoint}/lots`, lot).pipe(  
            tap((newLot) => {  
                this.lots.update(lots => [...lots, newLot]);  
            })  
        );  
    }  
  
    // PUT: update LOT  
    public updateLot(id: string, lot: Partial<Lot>) {  
        return this._http.put<Lot>(`${this._endpoint}/lots/${id}`, lot).pipe(  
            tap((updated) => {  
                this.lots.update(lots =>  
                    lots.map(l => l.Id === id ? updated : l)  
                );  
            })  
        );  
    }  
  
    // DELETE: delete LOT  
    public deleteLot(id: string) {  
        return this._http.delete(`${this._endpoint}/lots/${id}`).pipe(  
            tap(() => {  
                this.lots.update(lots => lots.filter(l => l.Id !== id));  
            })  
        );  
    }  
}