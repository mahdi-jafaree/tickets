import { notFound } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";
import {
	type ApiContracts,
	type ApiResponse,
	backendApi,
} from "./backendHandler";
import { isError } from "./isError";

export type AdminApiKeys = Omit<
	ApiContracts,
	| "login"
	| "register"
	| "createTicket"
	| "getTicketById"
	| "updateTicket"
	| "listAccounts"
	| "createTechnician"
>;
export const customerApis: AdminApiKeys = {
	listTickets: (req) => backendApi.listTickets(req),
};

type CustomerApi = {
	[Property in keyof AdminApiKeys]: () => ReturnType<ApiContracts[Property]>;
};

function frontendApiCaller(api: AdminApiKeys, req: NextRequest): CustomerApi {
	const queryParams = req.nextUrl.searchParams;
	return {
		listTickets: () =>
			api.listTickets({
				limit: queryParams.get("limit") ?? "50",
				skip: queryParams.get("skip") ?? "0",
				...(queryParams.get("status") && {
					status: queryParams.get("status") as string,
				}),
				...(queryParams.get("priority") && {
					priority: queryParams.get("priority") as string,
				}),
				...(queryParams.get("search") && {
					search: queryParams.get("search") as string,
				}),
			}),
	};
}

export const handler =
	(fn: (ctx: CustomerApi) => Promise<ApiResponse<unknown>>) =>
	async (req: NextRequest) => {
		const runnerApi = frontendApiCaller(customerApis, req);
		const result = await fn(runnerApi);

		if (isError(result)) {
			return notFound();
		}
		return NextResponse.json(result, { status: 200 });
	};
