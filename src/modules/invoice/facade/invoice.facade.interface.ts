import Address from "../../@shared/domain/value-object/address"
import InvoiceItems from "../domain/invoice-item.entity"

export interface GenerateInvoiceFacadeInputDto {
  id?: string
  name: string  
  document: string
  address: Address,
  items: InvoiceItems[]
}

export interface FindInvoiceFacadeInputDto {
  id: string
}

export interface FindInvoiceFacadeOutputDto {
  id: string
  name: string
  document: string
  address: Address
  items: []
  createdAt: Date
  updatedAt: Date
}

export default interface InvoiceFacadeInterface {
  generate(input: GenerateInvoiceFacadeInputDto): Promise<void>;
  find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto>;
}
