import type { Router } from "express";
import { getContainer } from "../container";
import { authenticateToken } from "../middleware/auth";

export function accountRouter(router: Router) {
	const { accountController } = getContainer().cradle;

	router.get("/accounts", authenticateToken, accountController.listAccounts);
}
