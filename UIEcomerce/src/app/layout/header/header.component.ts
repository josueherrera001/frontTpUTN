import { CurrencyPipe, NgClass, SlicePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Menu } from 'shared/models/menu';
import { MenuService } from 'shared/services/menu.service';
import { CartStore } from 'shared/store/shopping-cart.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgClass, CurrencyPipe, SlicePipe, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  showCart = signal<boolean>(false);
  cartStore = inject(CartStore);

  private readonly menus = inject( MenuService);
  public menus$ = this.menus.menus;
}
