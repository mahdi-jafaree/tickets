import type { Request, Response } from "express";
import type { TicketService } from "../services/ticket";

export class TicketController {
	constructor(private readonly ticketService: TicketService) {}

	createTicket = async (req: Request, res: Response) => {
		const { title, description, status, priority, assignedTo } = req.body;

		const ticket = await this.ticketService.createTicket({
			title,
			description,
			status,
			priority,
			assignedTo,
		});

		res.status(201).json(ticket);
	};

	getTicketById = async (req: Request, res: Response) => {
		const { id } = req.params;

		if (typeof id !== "string") {
			return res.status(400).json({ error: "Invalid ticket ID" });
		}

		const ticket = await this.ticketService.getTicketById(id);

		res.status(200).json(ticket);
	};

	getAllTickets = async (req: Request, res: Response) => {
		const { status, priority, assignedTo, search, limit, skip } = req.query;

		const tickets = await this.ticketService.getAllTickets({
			status: status as string | undefined,
			priority: priority as string | undefined,
			assignedTo: assignedTo as string | undefined,
			search: search as string | undefined,
			limit: limit ? Number(limit) : undefined,
			skip: skip ? Number(skip) : undefined,
		});

		res.status(200).json(tickets);
	};

	updateTicket = async (req: Request, res: Response) => {
		const { id } = req.params;

		if (typeof id !== "string") {
			return res.status(400).json({ error: "Invalid ticket ID" });
		}

		const { title, description, status, priority, assignedTo } = req.body;

		const ticket = await this.ticketService.updateTicket(id, {
			title,
			description,
			status,
			priority,
			assignedTo,
		});

		res.status(200).json(ticket);
	};

	deleteTicket = async (req: Request, res: Response) => {
		const { id } = req.params;

		if (typeof id !== "string") {
			return res.status(400).json({ error: "Invalid ticket ID" });
		}

		const result = await this.ticketService.deleteTicket(id);

		res.status(200).json(result);
	};
}
