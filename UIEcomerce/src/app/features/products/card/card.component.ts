import { CurrencyPipe, SlicePipe } from '@angular/common';
import { Component, EventEmitter, Output, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from 'shared/models/product.interface';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CurrencyPipe, SlicePipe, RouterLink],
  template:`
  <div class="p-4 mt-2 mb-6 overflow-hidden rounded-b-lg shadow-none hover:shadow-xl">
    <a class="relative block h-48 overflow-hidden rounded" [routerLink]="['/products', product().Id]">
      <img
        class="w-full transition duration-500 transform hover:scale-105"
        src="{{ product().image }}"
        alt="{{ product().title }}"
      />
    </a>

    <div class="mt-4">
      <h3 class="mb-1 text-xs tracking-widest text-gray-500 title-font">
      {{ product().category }}
      </h3>
      <h2 class="py-4 text-lg font-medium text-gray-900 title-font">
        <a  [routerLink]="['/products', product().Id]">
            {{ product().title | slice : 0 : 30 }}
        </a>
      </h2>
        <div class="flex items-center justify-between mt-1">
          <p class="text-2xl font-bold text-orange-500">
            {{ product().price | currency }}
          </p>
          <button
          (click)="onAddToCart()"
            class="px-2 py-1 text-white bg-orange-500 rounded hover:bg-orange-700" style="background-color: rgb(96 92 191)!important;">
            Add to cart
          </button>
        </div>
    </div>
  </div>
`,
})
export class CardComponent {
  product = input.required<Product>();//Angular 17
  // @input(required: true) productOld: Product; anterior a 17 hasta el 15 creo
  @Output() addCartEvent = new EventEmitter<Product>();

  onAddToCart():void {
    this.addCartEvent.emit(this.product());
  }

}
