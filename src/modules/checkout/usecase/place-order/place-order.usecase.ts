import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacade from "../../../client-adm/facade/client-adm.facade";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
    private _clientFacade: ClientAdmFacadeInterface;

    constructor(clientFacade: ClientAdmFacadeInterface){
        this._clientFacade = clientFacade
    }
    
    async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {        
        const client = await this._clientFacade.find({ id: input.clientId })

        if (!client){
            throw new Error("Client not found")
        }
        
        await this.validateProducts(input);
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

    private async validateProducts(input: PlaceOrderInputDto): Promise<void>{
        if (input.products.length === 0) throw new Error("No products selected")
    }
}