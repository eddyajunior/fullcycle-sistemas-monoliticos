export interface PlaceOrderInputDto {
    clientId: string
    product: {
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