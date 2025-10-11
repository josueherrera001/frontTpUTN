interface Rating{
    rate:number;
    count: number;
}

export interface Product{
    Id:number;
    title:string;
    price:number;
    category:string;
    description:string;
    image:string;
    qty:number;
    rating: Rating;
    subTotal: number;
}