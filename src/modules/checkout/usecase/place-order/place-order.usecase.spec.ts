import Id from '../../../@shared/domain/value-object/id.value-object';
import Product from '../../domain/product.entity';
import { PlaceOrderInputDto } from './place-order.dto';
import PlaceOrderUseCase from "./place-order.usecase";

const mockDate = new Date(2000, 1, 1);

describe("PlaceOrderUseCase unit tests", () => {

    describe("getProduct method", () => {
        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);            
        });

        afterAll(() => {
            jest.useRealTimers();
        })

        //@ts-expected-error - no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase();

        it("should return a product", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue({
                    id: "0",
                    name: "Product 0",
                    description: "Product 0 description",
                    salesPrice: 0
                })
            }

            //@ts-expected-error - force set catalogFacade 
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            await expect(placeOrderUseCase["getProduct"]("0"))
            .resolves.toEqual(
                new Product({
                    id: new Id("0"),
                    name: "Product 0",
                    description: "Product 0 description",
                    salesPrice: 0
                })
            );
            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
        });

        it("should throw an error when product not found", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null)
            }

            //@ts-expected-error - force set catalogFacade 
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            await expect(placeOrderUseCase["getProduct"]("0"))
            .rejects.toThrow(
                new Error("Product not found")
            )

        })
    })    
    describe("validateProducts method", () => {
        //@ts-expected-error - no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase();
        
        it("should throw error if no products are selected", async () => {
            const input: PlaceOrderInputDto = {
                clientId: "0",
                products: []
            }

            await expect(placeOrderUseCase["validateProducts"](input)
            ).rejects.toThrow(new Error("No products selected"))
        })

        it("should throw an error when product is out of stock", async () => {
            const mockProductFacade = {
                checkStock: jest.fn(({ productId }: { productId: string }) => 
                Promise.resolve({
                    productId,
                    stock: productId === "1" ? 0 : 1
                })
                ),
            };

            //@ts-expect-error - force set productFacade
            placeOrderUseCase["_productFacade"] = mockProductFacade;

            let input: PlaceOrderInputDto = {
                clientId: "0",
                products: [{ productId: "1" }],
            };

            await expect(placeOrderUseCase["validateProducts"](input)
            ).rejects.toThrow(new Error("Product 1 is not available in stock"))

            input = {
                clientId: "0",
                products: [{ productId: "0" }, { productId: "1" }],
            }

            await expect(
                placeOrderUseCase["validateProducts"](input)    
            ).rejects.toThrow(new Error("Product 1 is not available in stock"));

            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3)

            input = {
                clientId: "0",
                products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }, { productId: "3" }, { productId: "5" }]
            }
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3)
        });
    });

    describe("execute methods", () => {
        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);            
        });

        afterAll(() => {
            jest.useRealTimers();
        })        
        it("should throw an error when client not found", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null)
            };

            //@ts-expected-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();
            //@ts-expect-error - force set clientFacade
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = { clientId: "0", products: [] }

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new Error("Client not found"))
        })

        it("should throw an error when product are not value", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true)
            };

            //@ts-expected-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();

            const mockValidateProducts = jest 
            //@ts-expect-error - spy on private method
            .spyOn(placeOrderUseCase, "validateProducts")
            //@ts-expect-error - not return never 
            .mockRejectedValue(new Error("No products selected"));

            //@ts-expect-error - force set clientFacade
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = { clientId: "1", products: [] }

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new Error("No products selected")
            );
            expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        })

        describe("place an order", () => {
            const clientProps = {
                id: "1",
                name: "Client 0",
                document: "0000",
                email: "client@user.com",
                street: "some address",
                number: "1",
                complement: "",
                city: "some city",
                state: "some state",
                zipCode: "000"
            }

            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(clientProps)
            };

            const mockPaymentFacade = {
                process: jest.fn()
            }

            const mockCheckoutRepo = {
                addOrder: jest.fn()
            }

            const mockInvoiceFacade = {
                create: jest.fn().mockResolvedValue({ id: "li" })
            }

            const placeOrderUseCase = new PlaceOrderUseCase(
                mockClientFacade as any,
                null, 
                null,
                mockCheckoutRepo as any,
                mockInvoiceFacade as any,
                mockPaymentFacade
            );

            const products = {
                "1": new Product({
                    id: new Id("1"),
                    name: "Product 1",
                    description: "some description",
                    salesPrice: 40
                }),
                "2": new Product({
                    id: new Id("2"),
                    name: "Product 2",
                    description: "some description",
                    salesPrice: 30
                })
            }

            const mockValidateProducts = jest 
            //@ts-expect-error - spy on private method 
            .spyOn(placeOrderUseCase, "validateProducts")
            //@ts-expect-error - spy on private method 
            .mockResolvedValue(null);

            const mockGetProduct = jest 
            //@ts-expect-error - spy on private method 
            .spyOn(placeOrderUseCase, "getProduct")
            //@ts-expect-error - spy on private method 
            .mockImplementation((productId: keyof typeof products) => {
              return products[productId];
            });

            it("should not be approved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "li",
                    orderId: "lo",
                    amount: 100,
                    status: "error",
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                const input: PlaceOrderInputDto = {
                    clientId: "lc",
                    products: [ { productId: "1" }, { productId: "2" }]
                };

                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBeNull();
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([
                    { productId: "1"},
                    { productId: "2"}
                ])
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: input.clientId });
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockValidateProducts).toHaveBeenCalledWith(input);
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
                expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total
                });
                // expect(mockInvoiceFacade).toHaveBeenCalledTimes(0);
            })

            it("should be approved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 100,
                    status: "approved",
                    createdAt: new Date(),
                    updateAt: new Date,
                });

                const input: PlaceOrderInputDto = {
                    clientId: "1c",
                    products: [{ productId: "1" }, { productId: "2"} ]
                }

                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBe("1I");
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([
                    { productId: "1"},
                    { productId: "2"}
                ]);
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);                
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
                expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total
                });
                expect(mockInvoiceFacade.create).toHaveBeenCalledTimes(1);                
                expect(mockInvoiceFacade.create).toHaveBeenCalledWith({
                    name: clientProps.name,
                    document: clientProps.document,
                    street: clientProps.street,
                    number: clientProps.number,
                    complement: clientProps.complement,
                    city: clientProps.city,
                    state: clientProps.state,
                    zipCode: clientProps.zipCode,
                    items: [
                        {
                            id: products["1"].id.id,
                            name: products["1"].name,
                            price: products["1"].salesPrice
                        },
                        {
                            id: products["2"].id.id,
                            name: products["2"].name,
                            price: products["2"].salesPrice
                        }
                    ]
                });                
            })
        });
    })    
})