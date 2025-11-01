import { User } from './user';
import { Role } from './role.interface';

export interface Account {
    Id?: string;
    UserId?: string;
    RoleId: string;
    UserName: string;
    UserPass: string;
    EmailValidated: boolean;
    CreatedDate?: Date;
    FinalDate?: Date;
    State?: number;
    Role?: Role;
    User?: User;
    AccountMenu?: any[];
}
