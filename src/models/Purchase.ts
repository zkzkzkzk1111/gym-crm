export interface Purchase {
    idx?: number;
    type : string;
    name : string;
    buyer : string;
    cnt :number;
    price : number;
    paymentMethod : string;
    paidAt : string;
    status : number;
    phone : string;
    statusName:string;
}

export interface PurchaseRequest {
    memberIdx:number;
    type : string;
    name : string;
    cnt :number;
    price : number;
    paymentMethod : string;
}