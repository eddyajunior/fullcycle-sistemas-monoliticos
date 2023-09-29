import InvoiceItems from "../domain/invoice-item.entity";

export default interface InvoiceItemsGateway {
  add(invoice: InvoiceItems): Promise<void>;
  find(id: string): Promise<InvoiceItems>;
  findAll(): Promise<InvoiceItems[]>;  
}
