import { LineItemsModel } from "./line-items-model"

// export the model
export interface InvoiceModel {
  email: string
  fullName: string
  partsAmount: number
  laborAmount: number
  lineItemTotal: number
  invoiceTotal: number
  orderDate: string
  lineItems: LineItemsModel
}