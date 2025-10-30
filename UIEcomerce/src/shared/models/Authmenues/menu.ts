import { Submenu } from "./submenu";

export interface Menu {
    Id: string;
    Name: string;
    Url: string;
    HasSubMenu: boolean;
    Description: string;

    SubMenu: Submenu[];
}
