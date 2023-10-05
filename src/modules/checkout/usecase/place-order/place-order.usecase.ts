import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
    constructor(){}
    
    async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {        
        // buscar o cliente, caso não encontre retornar "client not found"
        // validar produto 
        // recuperar produto

        //criar o objeto client
        //criar o objeto order (client, products)
        
        //processar o pagamento (orderid, amount total)

        //caso pagamento aprovado, gerar invoice
        // mudar o status da order para approved
        //retornar dto
        return {
            id: "",
            invoiceId: "",
            status: "" ,
            total: 0,
            products: []
        }
    }    
}