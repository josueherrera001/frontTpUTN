import { CurrencyPipe, JsonPipe, NgClass, SlicePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AccountWithMenus } from 'shared/models/Authmenues/accountWithMenus';
import { Menu } from 'shared/models/Authmenues/menu';
import { Tokens } from 'shared/models/token';
import { AuthService } from 'shared/services/auth.service';
import { DecoderTokenService } from 'shared/services/decoder.token.service';
import { MenuService } from 'shared/services/menu.service';
import { TaskService } from 'shared/services/task.service';
import { UserMenuService } from 'shared/services/user.menu.service';
import { CartStore } from 'shared/store/shopping-cart.store';
import SpinnerComponent from "../../../shared/components/spinner.component";


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgClass, CurrencyPipe, SlicePipe, RouterOutlet, JsonPipe, SpinnerComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  showCart = signal<boolean>(false);
  cartStore = inject(CartStore);

  public menulist: AccountWithMenus[] =[]

  // private readonly menus = inject( MenuService);
  public menus$:Menu[] = [];
  UserName:string ="";

  constructor(
      private readonly taskService: TaskService,
      public readonly authService:AuthService,
      private readonly usermemnusvc:UserMenuService
    ){
  }
  ngOnInit(): void {
     let token = this.taskService.getJwtToken();
     if( token ){
        const tokensObj:any = DecoderTokenService.decodeToken(token);
        this.getMenu(tokensObj.Id);
        this.UserName = tokensObj.UserName;
     }
     else{
        this.getMenu("withoutlogin");
     }
  }

  getMenu(AccountId: string){
    this.menus$ = [];
    this.usermemnusvc.getUserWithMenus(AccountId).subscribe( ( menu:any ) =>{
     debugger;
     menu.forEach((element:any) => {
          this.menus$.push(element);
     });
    });
  }

 logout(): void {
      this.taskService.logout();
      location.reload();
      window.location.href ='/products/products'
  }
}
