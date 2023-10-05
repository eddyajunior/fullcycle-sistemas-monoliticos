export interface PlaceOrderInputDto {
    clientId: string
    products: {
        produtId: string
    }[]
}

export interface PlaceOrderOutputDto {
    id: string 
    invoiceId: string 
    status: string 
    total: number 
    products: {
        productId: string
    }[]
}