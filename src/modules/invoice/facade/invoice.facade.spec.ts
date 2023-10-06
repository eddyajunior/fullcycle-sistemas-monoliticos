import { Sequelize } from "sequelize-typescript"
import Address from "../../@shared/domain/value-object/address"
import { InvoiceModel } from "../repository/invoice.model"
import { InvoiceItemsModel } from "../repository/invoice-items.model"
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
    const facade = InvoiceFacadeFactory.create();

    const input = {
      name: "Lucian",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      items: [
        { id: "1", name: "Item 1", price: 12},
        { id: "2", name: "Item 2", price: 37.45}
      ]
    }

    const result = await facade.generate(input)

    const invoice = await InvoiceModel.findOne({ 
      where: { id: result.id },
      include: ["items"]
    })

    expect(invoice).toBeDefined()
    expect(invoice.id).toBe(result.id)
    expect(invoice.name).toBe(result.name)
    expect(invoice.document).toBe(result.document)
    expect(invoice.street).toBe(result.street)
    expect(invoice.number).toBe(result.number)
    expect(invoice.complement).toBe(result.complement)
    expect(invoice.city).toBe(result.city)
    expect(invoice.state).toBe(result.state)
    expect(invoice.zipcode).toBe(result.zipCode)
  })

  it("should find a invoice", async () => {
    
    const facade = InvoiceFacadeFactory.create()

    const input = {
      name: "Lucian",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      items: [
        { id: "1", name: "Item 1", price: 12},
        { id: "2", name: "Item 2", price: 37.45}
      ]
    }

    const result = await facade.generate(input)

    const invoice = await facade.find({ id: result.id })

    expect(invoice).toBeDefined()
    expect(invoice.id).toBe(result.id)
    expect(invoice.name).toBe(result.name)
    expect(invoice.document).toBe(result.document)
    expect(invoice.address.street).toBe(result.street)
    expect(invoice.address.number).toBe(result.number)
    expect(invoice.address.complement).toBe(result.complement)
    expect(invoice.address.city).toBe(result.city)
    expect(invoice.address.state).toBe(result.state)
    expect(invoice.address.zipCode).toBe(result.zipCode)
  })
})