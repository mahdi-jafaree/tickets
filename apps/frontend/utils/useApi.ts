import type { AxiosRequestHeaders } from "axios";
import { useMemo, useState } from "react";
import type { AdminApiKeys } from "./apiHandler";
import type { ApiResponse } from "./backendHandler";
import { createClientHandler } from "./clientApi";
import { isError as isApiError } from "./isError";

type ResData<T> = T extends (
	// biome-ignore lint/suspicious/noExplicitAny: keeping args any for util data
	...args: any[]
	// biome-ignore lint/suspicious/noExplicitAny: keeping args any for util data
) => Promise<ApiResponse<infer D, any>>
	? D
	: // biome-ignore lint/suspicious/noExplicitAny: keeping args any for util data
		any;

type ResError<T> = T extends (
	// biome-ignore lint/suspicious/noExplicitAny: keeping args any for util data
	...args: any[]
	// biome-ignore lint/suspicious/noExplicitAny: keeping args any for util data
) => Promise<ApiResponse<any, infer E>>
	? E
	: // biome-ignore lint/suspicious/noExplicitAny: keeping args any for util data
		any;

export type UseApiResult<ApiName extends keyof AdminApiKeys> = {
	data?: ResData<AdminApiKeys[ApiName]>;
	error?: ResError<AdminApiKeys[ApiName]>;
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	fetchApi: (
		...req: Parameters<AdminApiKeys[ApiName]>
	) => Promise<
		ApiResponse<ResData<AdminApiKeys[ApiName]>, ResError<AdminApiKeys[ApiName]>>
	>;
};

export type ApiStatus = "not_asked" | "loading" | "success" | "error";

export function useApi<ApiName extends keyof AdminApiKeys>(
	apiName: ApiName,
	options?: {
		headers?: AxiosRequestHeaders;
		onSuccess?: (data: ResData<AdminApiKeys[ApiName]>) => void;
		onError?: (error: ResError<AdminApiKeys[ApiName]>) => void;
	},
): UseApiResult<ApiName> {
	const [data, setData] = useState<ResData<AdminApiKeys[ApiName]>>();
	const [error, setError] = useState<ResError<AdminApiKeys[ApiName]>>();

	const [apiState, setApiState] = useState<ApiStatus>("not_asked");

	const isError = apiState === "error";
	const isSuccess = apiState === "success";
	const isLoading = apiState === "loading";

	const svc = useMemo(() => createClientHandler(options), [options]);

	const apiFn = svc[apiName] as (
		...req: unknown[]
	) => Promise<
		ApiResponse<ResData<AdminApiKeys[ApiName]>, ResError<AdminApiKeys[ApiName]>>
	>;

	const updateError = (value: ResError<AdminApiKeys[ApiName]> | undefined) => {
		setError(value);
	};
	const updateData = (value: ResData<AdminApiKeys[ApiName]> | undefined) => {
		setData(value);
	};
	let res: ApiResponse<
		ResData<AdminApiKeys[ApiName]>,
		ResError<AdminApiKeys[ApiName]>
	>;
	const fetchApi = async (...req: Parameters<AdminApiKeys[ApiName]>) => {
		try {
			setApiState("loading");
			res = await apiFn(...req);

			if (isApiError(res)) {
				options?.onError?.(res.error);
				switch (res.error) {
					case "bad_request":
						console.log(`Api Error: Bad Request`);
						updateError(res.error);
						break;
					case "not_found":
						console.log(`Api Error: Not found`);
						updateError(res.error);
						break;
					case "internal_error":
						console.log(`Api Error: Internal error`);
						updateError(res.error);
						break;
					case "unexpected_error":
						console.log(`Api Error: Unexpected error`);
						updateError(res.error);
						break;
					default:
						updateError(res.error);
						break;
				}
				setApiState("error");
			} else {
				updateError(undefined);
				updateData(res.data);
				options?.onSuccess?.(res.data);
				setApiState("success");
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.log(`Api Error: ${err.message}`);
			} else {
				console.log(`Api Error: Unexpected error`);
			}
			setApiState("error");
		} finally {
		}
		return res;
	};

	return {
		data,
		error,
		isError,
		isSuccess,
		isLoading,
		fetchApi,
	};
}
