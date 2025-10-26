import { Presentation } from './presentation.interface';
import { Lot } from "./lot.interface";
import { SubCategory } from "./subcategory.interface";
import { Supplier } from "./supplier.interface";

export interface Product{
    Id:string;
    SubCategoryId:string;
    PresentationId:string;
    SupplierId:string;
    Name:string;
    Description:string;
    ImageUrl:string;
    PublicIdUrl:string;
    expanded:boolean;
    qty:number;

    lots:Lot[];
    Supplier:Supplier;
    SubCategory:SubCategory
    Presentation?: Presentation
}
