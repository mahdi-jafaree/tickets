import type { NextFunction, Request, Response } from "express";
import { AccountRole } from "../entities";
import TicketError, { BrotherErrorTypes } from "../utils/error";

export function viewerRole(req: Request, _: Response, next: NextFunction) {
	const userRoles = req.session.account.roles;

	if (userRoles.length === 0) {
		throw new TicketError(
			BrotherErrorTypes.FORBIDDEN,
			"User has no roles",
			"forbidden",
		);
	}
	next();
}

export function managerRole(req: Request, _: Response, next: NextFunction) {
	const userRoles = req.session.account.roles;

	if (!userRoles.some((r:AccountRole) => r.role.name === "Admin")) {
		throw new TicketError(
			BrotherErrorTypes.FORBIDDEN,
			"User is not authorized",
			"forbidden",
		);
	}
	next();
}
