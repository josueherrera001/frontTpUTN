import { Account } from "./Account";
import { Address } from "./address";


export interface User {
  Id?: string;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;

  auth: Account;
  Address:Address;
}
