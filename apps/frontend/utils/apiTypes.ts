import type { SafeAccount } from "@tickets/backend";
import type { Ticket } from "@tickets/backend/src/entities";
import type { ApiResponse } from "./backendHandler";

export type GetTicketsReq = {
	limit: string;
	skip: string;
	status?: string;
	priority?: string;
	search?: string;
};

export type GetTicketsRes = ApiResponse<{ tickets: Ticket[]; count: number }>;
export type ListAccountsRes = ApiResponse<SafeAccount[]>;
