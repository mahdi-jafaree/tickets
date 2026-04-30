"use server";
import type { CreateTicketInput } from "@tickets/backend";
import { redirect } from "next/navigation";
import { backendApi } from "../backendHandler";
import { isError } from "../isError";

export async function createTicket(data: CreateTicketInput) {
	const res = await backendApi.createTicket(data);

	if (isError(res)) {
		return res;
	}

	redirect("/dashboard");
}
