export interface Lot {  
    Id: string;  
    ProductId: string;  
    LotCode: string;  
    ProductCode: string;  
    ExpiredDate?: Date;  
    HasExpiredDate: boolean;  
    stock: number;  
    PurchasePrice: number;  
    SalePrice: number;  
    CreatedDate?: Date;  
    State?: number;  
}
