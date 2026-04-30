import type { AxiosRequestHeaders, Method } from "axios";
import axios, { AxiosError } from "axios";
import type { ApiContracts, ApiResponse } from "./backendHandler";
import { constructUrl } from "./url";

export function createClientHandler(options?: {
	headers?: AxiosRequestHeaders;
}): Omit<ApiContracts, "register" | "login" | "getSession" | "createTicket"> {
	return {
		listTickets: (req) =>
			callClientApi("GET", constructUrl("tickets", req), undefined, options),
	};
}

async function callClientApi<Req extends Record<string, unknown>, T>(
	method: Method,
	endpoint: string,
	data?: Req,
	options?: { headers?: AxiosRequestHeaders },
): Promise<ApiResponse<T>> {
	try {
		const res = await axios({
			method,
			headers: {
				"Content-Type": "application/json",
				...options?.headers,
			},
			url: `/api/${endpoint}`,
			data,
		});

		return res.data;
	} catch (error) {
		if (error instanceof AxiosError) {
			if (error.response) {
				switch (error.response.status) {
					case 400:
						return {
							error: { code: error.response.data.code, message: "bad_request" },
						};
					default:
						return { error: { code: "bad_request", message: "bad_request" } };
				}
			} else if (error.request) {
				return { error: { code: "internal_error", message: "internal_error" } };
			} else {
				return { error: { code: "internal_error", message: "internal_error" } };
			}
		}

		return { error: { code: "internal_error", message: "internal_error" } };
	}
}
