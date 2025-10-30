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


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgClass, CurrencyPipe, SlicePipe, RouterOutlet,JsonPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  showCart = signal<boolean>(false);
  cartStore = inject(CartStore);

  public menulist: AccountWithMenus[] =[]

  private readonly menus = inject( MenuService);
  public menus$:Menu[] = [];

  constructor(
      private readonly taskService: TaskService,
      public readonly authService:AuthService,
      private readonly usermemnusvc:UserMenuService
    ){
  }
  ngOnInit(): void {
     let token = this.taskService.getJwtToken();
     if( token ){
        const tokensObj: Tokens = DecoderTokenService.decodeToken(token);
        this.getMenu(tokensObj.Id);
     }
     else{

     }
  }

  getMenu(AccountId: string){
    this.usermemnusvc.getUserWithMenus(AccountId).subscribe( ( menu:any ) =>{
     debugger;
     console.log(menu.AccountMenu);
     menu[0].AccountMenu.forEach((element:any) => {
      this.menus$.push(element.Menu);
     });
    });
  }

 logout(): void {
    this.taskService.logout();
  }
}
