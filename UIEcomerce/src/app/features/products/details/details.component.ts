import { Component, OnInit, Signal, inject, input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ProductsService } from '@api/products.service';
import { Product } from 'shared/models/product';
import { CartStore } from 'shared/store/shopping-cart.store';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'], // <- corregido
})
export class DetailsComponent implements OnInit { // <- export nombrado
  productId = input<number>(0, { alias: 'id' });
  product!: Signal<Product | undefined>;

  private readonly productSvc = inject(ProductsService);
  private readonly _sanitizer = inject(DomSanitizer);
  private readonly cartStore = inject(CartStore);

  starsArray: number[] = new Array(5).fill(0);

  ngOnInit(): void {
    // this.product = this.productSvc.getProductById(this.productId());
  }

  onAddToCart() {
    this.cartStore.addToCart(this.product() as Product);
  }

  generateSVG(index: number): SafeHtml {
    let svgContent: string | null = null;
    // const rate = this.product()?.rating.rate || 0;
    const rate =5

    if (index + 1 <= Math.floor(rate)) {
      svgContent = `<svg fill="currentColor" stroke="currentColor" ...>...</svg>`;
    } else if (index < rate) {
      svgContent = `<svg fill="url(#partialFillGradient)" ...>...</svg>`;
    } else {
      svgContent = `<svg fill="none" stroke="currentColor" ...>...</svg>`;
    }

    return this._sanitizer.bypassSecurityTrustHtml(svgContent);
  }
}
