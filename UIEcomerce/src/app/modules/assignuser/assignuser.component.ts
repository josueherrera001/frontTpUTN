import { Submenu } from './../../../shared/models/Authmenues/submenu';
import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Account } from 'shared/models/Account';
import { UserMenuService } from 'shared/services/user.menu.service';

@Component({
  selector: 'app-assignuser',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './assignuser.component.html',
  styleUrl: './assignuser.component.scss',
})
export class AssignuserComponent {
  account: Account[] = [];
  accountpanel!: Account;
  permissionActive: number = 0;
  moduloActive: number = 0;
  restiction: number = 0;
  restrictionGlobal: number = 0;

  constructor(private readonly usermemnusvc: UserMenuService) {
    this.getAllAccount();
  }

  getAllAccount() {
    debugger;
    this.usermemnusvc.getAllAccount().subscribe((resp: any) => {
      debugger;
      this.restrictionGlobal =
        resp.reduce(
          (acc: any, cur: any) =>
            acc +
            cur.AccountMenu.map((am: any) => am.Menu.SubMenu.length).reduce(
              (acc: any, cur: any) => acc + cur,
              0
            ),
          0
        );
      this.getAllMenusByAccountId(resp[0].Id);
      this.account = resp;
    });
  }

  getAllMenusByAccountId(AccounrId: string) {
    this.usermemnusvc.getUserWithMenus(AccounrId).subscribe((resp: any) => {
      this.accountpanel = resp[0];
      this.permissionActive = resp.reduce(
        (acc: any, cur: any) => acc + cur.AccountMenu.length,
        0
      );
      this.moduloActive = resp.reduce(
        (acc: any, cur: any) =>
          acc +
          cur.AccountMenu.map((am: any) => am.Menu.SubMenu.length).reduce(
            (acc: any, cur: any) => acc + cur,
            0
          ),
        0
      );
      this.restiction = this.restrictionGlobal - this.moduloActive;
    });
  }
}
