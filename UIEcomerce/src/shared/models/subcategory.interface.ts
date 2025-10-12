export interface SubCategory {  
    Id: string;  
    CategoryId: string;  // Relación con Category 
    Name: string;  
    Description?: string;  
    CreatedDate?: Date;  
    FinalDate?: Date;  
    State?: number;  
}