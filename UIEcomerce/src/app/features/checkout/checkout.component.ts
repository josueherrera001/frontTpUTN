import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CartStore } from 'shared/store/shopping-cart.store';
import { CheckoutService } from './services/checkout.service';
import { Router } from '@angular/router';
import { AuthService } from 'shared/services/auth.service';

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
constructor(private readonly auth:AuthService) {}
  onProceedToPay(): void {
  //    if (!this.auth.isAuthenticated()) {
  //     this.router.navigate(['/auth']);
  //     return;
  // }
    this._checkoutSvc.onProceedToPay(this.cartStore.products());
  }

  removeItem(id: string): void {
    this.cartStore.removeFromCart(id);
  }

  clearAll(): void {
    this.cartStore.clearCart();
  }
}
