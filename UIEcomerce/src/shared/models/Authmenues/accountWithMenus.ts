import { Account } from "../Account";
import { AccountMenu } from "./AccountMenu";
import { AccountMenuItem } from "./AccountMenuItem";
import { MenuWithItems } from "./menuWithItems";
import { Submenu } from "./submenu";

export interface AccountWithMenus extends Account {
  AccountMenu?: (AccountMenu & {
    menu: MenuWithItems;
    userMenuItems?: (AccountMenuItem & {
      menuItem: Submenu;
    })[];
  })[];
}
