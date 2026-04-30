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

	// Create a new ticket
	router.post(
		"/tickets",
		authenticateToken,
		validateData(CreateTicketSchema),
		ticketController.createTicket,
	);

	// Get all tickets (with optional filters)
	router.get("/tickets", authenticateToken, ticketController.getAllTickets);

	// Get a single ticket by ID
	router.get("/tickets/:id", authenticateToken, ticketController.getTicketById);

	// Update a ticket
	router.put(
		"/tickets/:id",
		authenticateToken,
		validateData(UpdateTicketSchema),
		ticketController.updateTicket,
	);

	// Delete a ticket (soft delete)
	router.delete(
		"/tickets/:id",
		authenticateToken,
		ticketController.deleteTicket,
	);
}
