import { Menu } from "./menu";
import { Submenu } from "./submenu";

export interface MenuWithItems extends Menu {
  menuItems?: Submenu[];
  children?: MenuWithItems[];
}
