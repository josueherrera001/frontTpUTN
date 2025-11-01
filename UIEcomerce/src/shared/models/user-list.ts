import { Account } from "./Account";    
import { Address } from "./address";    
    
export interface User {    
  Id?: string;    
  FirstName: string;    
  LastName: string;    
  Email?: string;  // Opcional ahora, ya que no se usa en el formulario de edición  
  Phone?: string;    
  PhoneNumber?: string;    
  CreatedDate?: Date;    
  FinalDate?: Date;    
  State?: number;    
      
  // Para datos del backend (GET) - Mantener para mostrar en la tabla  
  Accounts?: Account[];    
  Addresses?: Address[];    
      
  // Para el formulario de edición (PUT) - Simplificado  
  address?: {    
    Country: string;    
    Province: string;    
    Location: string;    
    Street: string;    
    Number: string;    
    Between?: string;    
  };  
    
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
}