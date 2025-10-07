import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <- IMPORTANTE
import { ProductsService } from '@api/products.service';
import { Product } from 'shared/models/product.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,               // <- importante
  imports: [FormsModule],         // <- forms module para [(ngModel)]
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {

  product: Partial<Product> = {
    title: '',
    price: 0,
    category: '',
    description: '',
    image: '',
    qty: 1,
    rating: { rate: 0, count: 0 },
    subTotal: 0
  };

  constructor(private productService: ProductsService) {}

  submit() {
    if (!this.product.title || !this.product.price || !this.product.category) {
      alert('Completa los campos obligatorios: título, precio y categoría.');
      return;
    }

    this.productService.createProduct({
      title: this.product.title!,
      price: this.product.price!,
      category: this.product.category!,
      description: this.product.description ?? '',
      image: this.product.image ?? '',
      qty: 1,
      rating: { rate: 0, count: 0 },
      subTotal: this.product.price!
    }).subscribe({
      next: () => {
        alert('Producto creado con éxito');
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        alert('Ocurrió un error al crear el producto.');
      }
    });
  }

  resetForm() {
    this.product = {
      title: '',
      price: 0,
      category: '',
      description: '',
      image: '',
      qty: 1,
      rating: { rate: 0, count: 0 },
      subTotal: 0
    };
  }

}
