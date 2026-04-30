import type { TicketRepository } from "../repositories/ticket.repository";
import TicketError, { BrotherErrorTypes } from "../utils/error";

export class TicketService {
	constructor(private readonly ticketRepository: TicketRepository) {}

	async createTicket(data: {
		title: string;
		description: string;
		status: string;
		priority: string;
		assignedTo?: string | null;
	}) {
		const ticket = await this.ticketRepository.create(data);
		return ticket;
	}

	async getTicketById(id: string) {
		const ticket = await this.ticketRepository.findOne({
			where: { id },
			relations: ["assignedTo"],
		});

		if (!ticket) {
			throw new TicketError(
				BrotherErrorTypes.NOT_FOUND,
				"Ticket not found",
				"ticket_not_found",
			);
		}

		return ticket;
	}

	async getAllTickets(filters?: {
		status?: string;
		priority?: string;
		assignedTo?: string;
	}) {
		const where: Record<string, unknown> = {};

		if (filters?.status) {
			where.status = filters.status;
		}

		if (filters?.priority) {
			where.priority = filters.priority;
		}

		if (filters?.assignedTo) {
			where.assignedTo = { id: filters.assignedTo };
		}

		const tickets = await this.ticketRepository.find({
			where,
			relations: ["assignedTo"],
			order: { createdAt: "DESC" },
		});

		return tickets;
	}

	async updateTicket(
		id: string,
		data: {
			title?: string;
			description?: string;
			status?: string;
			priority?: string;
			assignedTo?: string | null;
		},
	) {
		// Check if ticket exists
		await this.getTicketById(id);

		const updateData: Record<string, unknown> = { ...data };

		if (data.assignedTo !== undefined) {
			updateData.assignedTo = data.assignedTo ? { id: data.assignedTo } : null;
		}

		const updatedTicket = await this.ticketRepository.update(id, updateData);

		return updatedTicket;
	}

	async deleteTicket(id: string) {
		// Check if ticket exists
		await this.getTicketById(id);

		await this.ticketRepository.softDelete(id);

		return { message: "Ticket deleted successfully" };
	}
}
