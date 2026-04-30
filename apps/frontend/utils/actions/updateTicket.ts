"use server";
import type { UpdateTicketInput } from "@tickets/backend";
import { revalidatePath } from "next/cache";
import { backendApi } from "../backendHandler";
import { isError } from "../isError";

export async function updateTicket(id: string, data: UpdateTicketInput) {
	const res = await backendApi.updateTicket(id, data);
	if (isError(res)) {
		return res;
	}
	revalidatePath(`/tickets/${id}`);
	revalidatePath("/dashboard");
	return res;
}
