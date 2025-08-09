import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { loadStripe } from "@stripe/stripe-js";
import { environment } from "environments/environment.development";
import { map } from "rxjs";
import { Product } from "shared/models/product.interface";

@Injectable({ providedIn:'root'})
export class CheckoutService{

    private readonly _http = inject(HttpClient);
    private readonly _url = environment.serverURL;

    onProceedToPay(products:Product[]){
        return this._http.post(`${this._url}/checkout`,{items:products})
            .pipe(
                map( async( res: any) =>{
                    const stripe = await loadStripe(environment.stripeApiKey);
                    stripe?.redirectToCheckout({ sessionId: res.id});
                })
            ).subscribe(
                {
                    error: (err) => console.error(err)
                }
            );
    }
}