import { Sequelize } from "sequelize-typescript"
import Address from "../../@shared/domain/value-object/address"
import { InvoiceModel } from "../repository/invoice.model"
import { InvoiceItemsModel } from "../repository/invoice-items.model"
import InvoiceRepository from "../repository/invoice.repository"
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase"
import InvoiceFacade from "./invoice.facade"
import InvoiceItems from "../domain/invoice-item.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"


describe("Invoice Facade tests", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([InvoiceModel, InvoiceItemsModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should create a invoice", async () => {

    const repository = new InvoiceRepository()
    const generateUsecase = new GenerateInvoiceUseCase(repository)
    const facade = new InvoiceFacade({
      generateUsecase: generateUsecase,
      findUsecase: undefined,
    })

    const input = {
      id: "1",
      name: "Lucian",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888",
      ),
      items: [
        new InvoiceItems({ id: new Id("1"), name: "Item 1", price: 12}),
        new InvoiceItems({ id: new Id("2"), name: "Item 2", price: 37.45})
      ]
    }

    await facade.generate(input)

    const invoice = await InvoiceModel.findOne({ 
        where: { id: "1" },
        include: ["items"]
    })

    expect(invoice).toBeDefined()
    expect(invoice.id).toBe(input.id)
    expect(invoice.name).toBe(input.name)    
    expect(invoice.document).toBe(input.document)
    expect(invoice.street).toBe(input.address.street)
  })

  it("should find a invoice", async () => {
    
    const facade = InvoiceFacadeFactory.create()

    const input = {
      id: "1",
      name: "Lucian",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      ),
      items: [
        new InvoiceItems({ id: new Id('1'), name: 'Item 1', price: 12 })
      ]
    }

    await facade.generate(input)

    const client = await facade.find({ id: "1" })

    expect(client).toBeDefined()
    expect(client.id).toBe(input.id)
    expect(client.name).toBe(input.name)
    expect(client.document).toBe(input.document)
    expect(client.address.street).toBe(input.address.street)
    expect(client.address.number).toBe(input.address.number)
    expect(client.address.complement).toBe(input.address.complement)
    expect(client.address.city).toBe(input.address.city)
    expect(client.address.state).toBe(input.address.state)
    expect(client.address.zipCode).toBe(input.address.zipCode)
  })
})