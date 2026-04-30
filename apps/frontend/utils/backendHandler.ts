import type { LoginInput, RegisterInput, SafeAccount } from "@tickets/backend";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { GetTicketsReq, GetTicketsRes } from "./apiTypes";
import { constructUrl } from "./url";

export type BackendResponse<T> = {
	data: T;
};

export type SuccessResponse<T> = { data: T; error?: never };
export type ErrorResponse<E> = {
	error: E;
	data?: never;
};
export type ApiResponse<T, E = { code: string; message: string }> =
	| SuccessResponse<T>
	| ErrorResponse<E>;

export type ApiContracts = {
	listTickets: (req: GetTicketsReq) => Promise<GetTicketsRes>;
	login: (
		req: LoginInput,
	) => Promise<ApiResponse<{ token: string; account: SafeAccount }>>;
	register: (
		req: RegisterInput,
	) => Promise<ApiResponse<{ token: string; account: SafeAccount }>>;
};

export const backendCaller = async <Req extends Record<string, unknown>, T>(
	endpoint: string,
	method: "GET" | "POST" | "PUT" | "DELETE",
	data?: Req,
): Promise<ApiResponse<T>> => {
	const cookiesStore = await cookies();
	try {
		const url = `${process.env.BACKEND_URL}/api/admin/${endpoint}`;
		const token = cookiesStore.get("session");

		const response = await axios({
			method,
			url,
			data,
			headers: {
				"Content-Type": "application/json",
				Authorization: `session=${token?.value}`,
			},
		});

		return { data: response.data };
	} catch (error) {
		if (error instanceof AxiosError) {
			if (error.status === 401) {
				redirect("/login");
			}
			return {
				error: {
					code: error?.response?.data.code ?? "",
					message: error?.response?.data.message ?? "",
				},
			};
		}
		return { error: { code: "internal_error", message: "internal_error" } };
	}
};
export const publicBackendCaller = async <
	Req extends Record<string, unknown>,
	T,
>(
	endpoint: string,
	method: "GET" | "POST" | "PUT" | "DELETE",
	data?: Req,
): Promise<ApiResponse<T>> => {
	try {
		const url = `${process.env.BACKEND_URL}/api/admin/${endpoint}`;

		const response = await axios({
			method,
			url,
			data,
			headers: {
				"Content-Type": "application/json",
			},
		});

		return { data: response.data };
	} catch (error) {
		if (error instanceof AxiosError) {
			console.log(error.response?.data);
			return {
				error: {
					code: error?.response?.data.code ?? "",
					message: error?.response?.data.message ?? "",
				},
			};
		}
		return { error: { code: "internal_error", message: "internal_error" } };
	}
};

export const backendApi: ApiContracts = {
	login: (req) => publicBackendCaller(`auth/login`, "POST", req),
	register: (req) => publicBackendCaller(`auth/register`, "POST", req),
	listTickets: (req) => backendCaller(constructUrl("tickets", req), "GET"),
};
