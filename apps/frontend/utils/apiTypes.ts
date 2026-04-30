import type { Ticket } from "@tickets/backend/src/entities";
import type { ApiResponse } from "./backendHandler";

export type GetTicketsReq = {
	limit: string;
	skip: string;
};

export type GetTicketsRes = ApiResponse<{ tickets: Ticket; count: number }>;
