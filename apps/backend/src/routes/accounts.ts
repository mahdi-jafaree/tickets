import type { Router } from "express";
import { getContainer } from "../container";
import { authenticateToken, requireAdmin } from "../middleware/auth";
import { CreateTechnicianSchema } from "../types/schemas";
import { validateData } from "../utils/validate";

export function accountRouter(router: Router) {
	const { accountController } = getContainer().cradle;

	router.get("/accounts", authenticateToken, accountController.listAccounts);
	router.post(
		"/accounts/technicians",
		authenticateToken,
		requireAdmin,
		validateData(CreateTechnicianSchema),
		accountController.createTechnician,
	);
}
