export interface Lot {  
    id: string;  
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
