/*
======================================
; Title: invoice-model.ts
; Author: Chris Gorham, Shane Hingtgen
; Date Created: 26 September 2023
; Last Updated: 26 September 2023
; Description: This code supports the Invoice Model
; Sources Used: N/A
;=====================================
*/

// imports
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
  lineItems: LineItemsModel[]
}