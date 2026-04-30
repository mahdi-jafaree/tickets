import type { NextFunction, Request, Response } from "express";
import { getContainer } from "../container";
import type { SafeAccount } from "../types";
import TicketError, { BrotherErrorTypes } from "../utils/error";
import { verifyToken } from "../utils/jwt";

export async function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader?.split("=")[1];

		if (!token) {
			throw new TicketError(
				BrotherErrorTypes.UNAUTHORIZED,
				"unauthorized_error",
				"unauthorized_error",
			);
		}

		const { accountId } = await verifyToken(token);

		const container = getContainer().cradle;
		const accService = container.accountService;
		const account = await accService.retrieve(accountId);

		if (!account) {
			throw new TicketError(
				BrotherErrorTypes.UNAUTHORIZED,
				"unauthorized_error",
				"unauthorized_error",
			);
		}

		const session: { account: SafeAccount } = {
			account: {
				firstName: account.firstName,
				lastName: account.lastName,
				emailAddress: account.emailAddress,
				id: account.id,
				roles: account.roles,
				createdAt: account.createdAt,
				updatedAt: account.updatedAt,
			},
		};

		req.session = session;
		next();
	} catch {
		return res
			.status(401)
			.json({ code: "unauthorized", message: "unauthorized" });
	}
}
