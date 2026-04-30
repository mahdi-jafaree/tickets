import type { Router } from "express";
import { getContainer } from "../container";
import { authenticateToken } from "../middleware/auth";
import {
	CreateTicketSchema,
	UpdateTicketSchema,
} from "../types/schemas/ticket";
import { validateData } from "../utils/validate";

export function ticketRouter(router: Router) {
	const { ticketController } = getContainer().cradle;

	router.post(
		"/tickets",
		authenticateToken,
		validateData(CreateTicketSchema),
		ticketController.createTicket,
	);

	router.get(
		"/tickets",
		// authenticateToken,
		ticketController.getAllTickets,
	);

	router.get("/tickets/:id", authenticateToken, ticketController.getTicketById);

	router.put(
		"/tickets/:id",
		authenticateToken,
		validateData(UpdateTicketSchema),
		ticketController.updateTicket,
	);

	router.delete(
		"/tickets/:id",
		authenticateToken,
		ticketController.deleteTicket,
	);
}
