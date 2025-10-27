import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CartStore } from 'shared/store/shopping-cart.store';
import { CheckoutService } from './services/checkout.service';
import { Router } from '@angular/router';
import { AuthService } from 'shared/services/auth.service';
import { Product } from 'shared/models/product.interface';
import { Product as Pro} from 'shared/models/product';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export default class CheckoutComponent {
  cartStore = inject(CartStore);
//  private readonly  router = inject(Router);
  // private readonly authService = inject(AuthService);

  private readonly _checkoutSvc = inject(CheckoutService);
  private product:Product[] = [];
constructor(private readonly auth:AuthService) {}
  onProceedToPay(): void {
  //    if (!this.auth.isAuthenticated()) {
  //     this.router.navigate(['/auth']);
  //     return;
  // }
  debugger;
    for (let index = 0; index < this.cartStore.products().length; index++) {
      const element = this.cartStore.products()[index];
      this.product.push({
        id:0,
        title: element.Name,
        price: element.subTotal!,
        qty: element.qty,
        image:element.ImageUrl,
        category: element.SubCategory.Name,
        description: element.Description,
        rating:4,
        subTotal: element.subTotal!,
      })

    }
    this._checkoutSvc.onProceedToPay(this.product);
  }

  removeItem(id: string): void {
    this.cartStore.removeFromCart(id);
  }

  clearAll(): void {
    this.cartStore.clearCart();
  }
}
