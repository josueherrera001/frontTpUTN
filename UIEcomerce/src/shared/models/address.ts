export interface Address{
    Id:string;
    UserId:string;
    Street: string;

    Number?: string;
    StreetNumber?: string;

    Between?: string;
    BetweenStreet?: string;
    
    Country: string;
    Location: string;
    Province: string;
}