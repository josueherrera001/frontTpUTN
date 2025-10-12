import { HttpClient } from "@angular/common/http";
import { EnvironmentInjector, Injectable, inject, runInInjectionContext, signal } from "@angular/core";
import { environment } from "environments/environment";
import { map, tap } from "rxjs";
import { Product } from "shared/models/product.interface";
import { toSignal } from '@angular/core/rxjs-interop';


@Injectable({providedIn: 'root'})
export class ProductsService{
    public products = signal<Product[]>([]);
    private readonly _http = inject( HttpClient);
    private readonly _endpoint = environment.apiURL;
    private readonly _injector = inject(EnvironmentInjector);

    constructor(){
        this.getProduct();
    }
// GET PRODUCTS LIST
    public getProduct(): void{
        this._http.get<Product[]>(`${ this._endpoint}/products?sort=desc`)
            .pipe(
                map( (products: Product[]) => products.map((product:Product)=>({ ...product, qty:1}))),
                 tap(( products: Product[]) => this.products.set(products)))
            .subscribe();
    }
// get PRODUCT BY ID
    public getProductById(id: number) {
        return runInInjectionContext( this._injector, () =>
            toSignal<Product>(this._http.get<Product>(`${ this._endpoint}/products/${id}`))
        );
    }
//POST: create PRODUCT
    public createProduct(product: Omit<Product, "id">) {
        return this._http.post<Product>( this._endpoint, product).pipe(
        tap((newProduct ) => {
            this.products.update(products => [...products, { ...newProduct, qty:1}]);
        })
        );
    
    }
 // PUT: actualizar producto 
  public updateProduct(id: number, product: Partial<Product>) {
    return this._http.put<Product>(`${this._endpoint}/${id}`, product).pipe(
      tap((updated) => {
        this.products.update(products =>
          products.map(p => p.Id === id ? { ...updated, qty: 1 } : p)
        );
      })
    );
  }

  // DELETE: eliminar producto 
  public deleteProduct(id: number) {
    return this._http.delete(`${this._endpoint}/${id}`).pipe(
      tap(() => {
        this.products.update(products => products.filter(p => p.Id !== id));
      })
    );
    
  }
}
"P"