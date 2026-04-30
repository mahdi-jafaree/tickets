"use server";
import type { CreateTechnicianInput } from "@tickets/backend";
import { backendApi } from "../backendHandler";
import { isError } from "../isError";

export async function createTechnician(data: CreateTechnicianInput) {
	const res = await backendApi.createTechnician(data);

	if (isError(res)) {
		return res;
	}

	return { data: res.data };
}
