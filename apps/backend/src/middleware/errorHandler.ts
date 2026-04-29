import type { NextFunction, Request, Response } from "express";
import type TicketError from "../utils/error";
import { BrotherErrorTypes } from "../utils/error";

export function errorHandler(
	error: TicketError,
	_: Request,
	res: Response,
	__: NextFunction,
) {
	console.log(error);
	switch (error.type) {
		case BrotherErrorTypes.BAD_REQUEST:
		case BrotherErrorTypes.DUPLICATE_ERROR:
			res.status(400).json({
				message: error.message,
				code: error.code,
				type: error.type,
				data: error.data ?? null,
			});
			break;
		case BrotherErrorTypes.NOT_FOUND:
			res.status(404).json({
				message: error.message,
				code: error.code,
				type: error.type,
				data: error.data ?? null,
			});
			break;
		case BrotherErrorTypes.UNAUTHORIZED:
			res.status(401).json({
				message: "unauthorized",
				code: "unauthorized",
				type: "unauthorized",
				data: error.data ?? null,
			});
			break;
		case BrotherErrorTypes.FORBIDDEN:
			res.status(403).json({
				message: error.message,
				code: error.code,
				type: "forbidden",
				data: error.data ?? null,
			});
			break;
		default:
			res.status(500).json({
				message: "server error",
				code: "server_error",
				type: "internal_error",
				data: null,
			});
	}
}
