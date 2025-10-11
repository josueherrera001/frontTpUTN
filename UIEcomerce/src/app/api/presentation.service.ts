import { HttpClient } from "@angular/common/http";  
import { EnvironmentInjector, Injectable, inject, runInInjectionContext, signal } from "@angular/core";  
import { environment } from "environments/environment";  
import { tap } from "rxjs";  
import { Presentation } from "shared/models/presentation.interface";  
import { toSignal } from '@angular/core/rxjs-interop';  
  
@Injectable({providedIn: 'root'})  
export class PresentationsService {  
    public presentations = signal<Presentation[]>([]);  
    private readonly _http = inject(HttpClient);  
    private readonly _endpoint = environment.apiURL;  
    private readonly _injector = inject(EnvironmentInjector);  
  
    constructor() {  
        this.getPresentations();  
    }  
  
    // GET PRESENTATIONS LIST  
    public getPresentations(): void {  
        this._http.get<Presentation[]>(`${this._endpoint}/presentations`)  
            .pipe(  
                tap((presentations: Presentation[]) => this.presentations.set(presentations))  
            )  
            .subscribe();  
    }  
  
    // GET PRESENTATION BY ID  
    public getPresentationById(id: string) {  
        return runInInjectionContext(this._injector, () =>  
            toSignal<Presentation>(this._http.get<Presentation>(`${this._endpoint}/presentations/${id}`))  
        );  
    }  
  
    // POST: create PRESENTATION  
    public createPresentation(presentation: Omit<Presentation, "id">) {  
        return this._http.post<Presentation>(`${this._endpoint}/presentations`, presentation).pipe(  
            tap((newPresentation) => {  
                this.presentations.update(presentations => [...presentations, newPresentation]);  
            })  
        );  
    }  
  
    // PUT: update PRESENTATION  
    public updatePresentation(id: string, presentation: Partial<Presentation>) {  
        return this._http.put<Presentation>(`${this._endpoint}/presentations/${id}`, presentation).pipe(  
            tap((updated) => {  
                this.presentations.update(presentations =>  
                    presentations.map(p => p.Id === id ? updated : p)  
                );  
            })  
        );  
    }  
  
    // DELETE: delete PRESENTATION  
    public deletePresentation(id: string) {  
        return this._http.delete(`${this._endpoint}/presentations/${id}`).pipe(  
            tap(() => {  
                this.presentations.update(presentations => presentations.filter(p => p.Id !== id));  
            })  
        );  
    }  
}