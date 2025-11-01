import { Account } from "./Account";  
import { Address } from "./address";  
  
export interface User {  
  Id?: string;  
  FirstName: string;  
  LastName: string;  
  Email: string;  
  Phone?: string;  
  PhoneNumber?: string;  
  CreatedDate?: Date;  
  FinalDate?: Date;  
  State?: number;  
    
  // Para datos del backend (GET)  
  Accounts?: Account[];  
  Addresses?: Address[];  
    
  // Para el formulario (POST/PUT)  
  auth?: {  
    UserName: string;  
    UserPass: string;  
    RoleId: string;  
    Role?: {  
      Id: string;  
      Name: string;  
      Description?: string;  
    };  
  };  
  address?: {  
    Country: string;  
    Province: string;  
    Location: string;  
    Street: string;  
    Number: string;  
    Between?: string;  
  };  
}