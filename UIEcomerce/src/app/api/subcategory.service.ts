import { HttpClient } from "@angular/common/http";
import { EnvironmentInjector, Injectable, inject, runInInjectionContext, signal } from "@angular/core";
import { environment } from "environments/environment";
import { Observable, tap } from "rxjs";
import { SubCategory } from "shared/models/subcategory.interface";
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({providedIn: 'root'})
export class SubCategoriesService {
    public subCategories = signal<SubCategory[]>([]);
    private readonly _http = inject(HttpClient);
    private readonly _endpoint = environment.apiURLlocal;
    private readonly _injector = inject(EnvironmentInjector);

    constructor() {
        // this.getSubCategories();
    }

    // GET SUBCATEGORIES LIST
    public getSubCategories(CategoryId: string): Observable<SubCategory[]> {
        return this._http.get<SubCategory[]>(`${this._endpoint}subcategories/sub-category/${CategoryId}`);
    }

    // GET SUBCATEGORY BY ID
    public getSubCategoryById(id: string) {
        return runInInjectionContext(this._injector, () =>
            toSignal<SubCategory>(this._http.get<SubCategory>(`${this._endpoint}subcategories/${id}`))
        );
    }

    // POST: create SUBCATEGORY
    public createSubCategory(subCategory: Omit<SubCategory, "Id">) {
        return this._http.post<SubCategory>(`${this._endpoint}subcategories`, subCategory).pipe(
            tap((newSubCategory) => {
                this.subCategories.update(subCategories => [...subCategories, newSubCategory]);
            })
        );
    }

    // PUT: update SUBCATEGORY
    public updateSubCategory(id: string, subCategory: Partial<SubCategory>) {
        return this._http.put<SubCategory>(`${this._endpoint}subcategories/${id}`, subCategory).pipe(
            tap((updated) => {
                this.subCategories.update(subCategories =>
                    subCategories.map(sc => sc.Id === id ? updated : sc)
                );
            })
        );
    }

    // DELETE: delete SUBCATEGORY
    public deleteSubCategory(id: string) {
        return this._http.delete(`${this._endpoint}subcategories/${id}`).pipe(
            tap(() => {
                this.subCategories.update(subCategories => subCategories.filter(sc => sc.Id !== id));
            })
        );
    }
}
