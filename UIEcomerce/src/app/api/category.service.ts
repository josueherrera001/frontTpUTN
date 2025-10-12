import { HttpClient } from "@angular/common/http";  
import { EnvironmentInjector, Injectable, inject, runInInjectionContext, signal } from "@angular/core";  
import { environment } from "environments/environment";  
import { tap } from "rxjs";  
import { Category } from "shared/models/category.interface";  
import { toSignal } from '@angular/core/rxjs-interop';  
  
@Injectable({providedIn: 'root'})  
export class CategoriesService {  
    public categories = signal<Category[]>([]);  
    private readonly _http = inject(HttpClient);  
    private readonly _endpoint = environment.apiURL;  
    private readonly _injector = inject(EnvironmentInjector);  
  
    constructor() {  
        this.getCategories();  
    }  
  
    // GET CATEGORIES LIST  
    public getCategories(): void {  
        this._http.get<Category[]>(`${this._endpoint}/categories`)  
            .pipe(  
                tap((categories: Category[]) => this.categories.set(categories))  
            )  
            .subscribe();  
    }  
  
    // GET CATEGORY BY ID  
    public getCategoryById(id: string) {  
        return runInInjectionContext(this._injector, () =>  
            toSignal<Category>(this._http.get<Category>(`${this._endpoint}/categories/${id}`))  
        );  
    }  
  
    // POST: create CATEGORY  
    public createCategory(category: Omit<Category, "id">) {  
        return this._http.post<Category>(`${this._endpoint}/categories`, category).pipe(  
            tap((newCategory) => {  
                this.categories.update(categories => [...categories, newCategory]);  
            })  
        );  
    }  
  
    // PUT: update CATEGORY  
    public updateCategory(id: string, category: Partial<Category>) {  
        return this._http.put<Category>(`${this._endpoint}/categories/${id}`, category).pipe(  
            tap((updated) => {  
                this.categories.update(categories =>  
                    categories.map(c => c.Id === id ? updated : c)  
                );  
            })  
        );  
    }  
  
    // DELETE: delete CATEGORY  
    public deleteCategory(id: string) {  
        return this._http.delete(`${this._endpoint}/categories/${id}`).pipe(  
            tap(() => {  
                this.categories.update(categories => categories.filter(c => c.Id !== id));  
            })  
        );  
    }  
}