import { ticketModel } from "../../../models/ticket.model.js";


export async function createTicket(ticket){
  return await ticketModel.create(ticket)
}