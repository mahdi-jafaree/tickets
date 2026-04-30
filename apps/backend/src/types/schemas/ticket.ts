import { z } from "zod";

export const CreateTicketSchema = z.object({
	title: z.string().min(1, "Title is required").max(255, "Title too long"),
	description: z.string().min(1, "Description is required"),
	status: z.string().min(1, "Status is required"),
	priority: z.string().min(1, "Priority is required"),
	assignedTo: z.uuid("Invalid account ID").optional().nullable(),
});

export const UpdateTicketSchema = z.object({
	title: z.string().min(1).max(255).optional(),
	description: z.string().min(1).optional(),
	status: z.string().min(1).optional(),
	priority: z.string().min(1).optional(),
	assignedTo: z.uuid("Invalid account ID").optional().nullable(),
});

export const TicketIdSchema = z.object({
	id: z.uuid("Invalid ticket ID"),
});

export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;
export type UpdateTicketInput = z.infer<typeof UpdateTicketSchema>;
export type TicketIdInput = z.infer<typeof TicketIdSchema>;
