import type z from "zod";
import TicketError, { BrotherErrorTypes } from "./error";

export function zValidator<T extends z.ZodType>(Schema: T, body: unknown) {
	try {
		const data = Schema.parse(body);
		return data;
	} catch {
		throw new TicketError(
			BrotherErrorTypes.BAD_REQUEST,
			"invalid_input",
			"invalid_input",
		);
	}
}
