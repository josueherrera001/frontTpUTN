import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { ToastrService } from "ngx-toastr";
import { Product } from "shared/models/product";

export interface CartStore{
    products:Product[];
    totalAmount:number;
    productsCount: number;
}

const initialState: CartStore ={
    products:[],
    totalAmount:0,
    productsCount:0
}

export const CartStore = signalStore(
    { providedIn:'root'},
    withState(initialState),
    withComputed(({  products })=>({
        productsCount: computed(() => calculateProductCount(products())),
        totalAmount: computed(() => calculateTotalAmount(products())),
    })),
    withMethods( ({products, ...store}, toastrSvc =inject(ToastrService)) => ({
        addToCart(product:Product){
          debugger;
            const isProductInCart = products().find( (pro) =>pro.Id === product.Id);
            if (isProductInCart){
                isProductInCart.qty++;
                isProductInCart.subTotal = isProductInCart.qty * isProductInCart.lots[0].SalePrice;
                patchState(store,{ products: [...products()] });
            }
            else{
              product.qty = 1;
              product.subTotal = product.lots[0].SalePrice;
            patchState(store,{ products: [...products(),product] });
            }
            toastrSvc.success('Producto agregado','TP UTN');
        },
        removeFromCart(id: string){
            // const updateProduct = products().filter( product => product.Id == id);
            // if (updateProduct[0].qty > 1){
            //     updateProduct[0].qty--;

            //     patchState(store,{ products: [...products()]});
            // }
            // else{
            //     const updateProductone = products().filter( product => product.Id != id);
            //     patchState(store,{ products: updateProductone });
            // }
            toastrSvc.info('Producto eliminado','TP UTN');
        },
        clearCart(){
            patchState(store, initialState)
            toastrSvc.info('Carrito vacio','TP UTN');
        }
    })),
);

function calculateTotalAmount(products: Product[]):number{
  debugger
    return products.reduce((acc, product) => acc + (product.lots[0].SalePrice * product.qty), 0)
}

function calculateProductCount(products: Product[]):number{
  debugger
    return products.reduce((acc, product) => acc + product.qty, 0)
}
