import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { ProductsService } from '@api/products.service';
import { Product } from 'shared/models/product.interface';
import { CartStore } from 'shared/store/shopping-cart.store';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <section class="text-gray-600 body-font">
      <div class="container px-5 py-24 mx-auto">
        <div class="flex flex-wrap -m-4">
          @for (product of products(); track $index) {
            <app-card
              class="w-full p-4 lg:w-1/4 md:w-1/2"
              [product]="product"
              (addCartEvent)="onAddToCart($event)"
            />
          }
        </div>
      </div>
    </section>
  `,
})
export class ProductsComponent {
  private readonly productSvc = inject(ProductsService);
  products = this.productSvc.products;
  private readonly cartStore = inject(CartStore);

  onAddToCart(product: Product): void {
    this.cartStore.addToCart(product);
  }
}
