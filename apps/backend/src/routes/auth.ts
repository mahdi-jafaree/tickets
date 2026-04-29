import type { Router } from "express";
import { getContainer } from "../container";
import { authenticateToken } from "../middleware/auth";
import { LoginSchema, RegisterSchema } from "../types/schemas"; // Add RegisterSchema
import { validateData } from "../utils/validate";

export function authRouter(router: Router) {
	const { authController } = getContainer().cradle;

	router.get("/auth/session", authenticateToken, authController.getSession);
	router.post("/auth/login", validateData(LoginSchema), authController.login);
	router.post(
		"/auth/register",
		validateData(RegisterSchema),
		authController.register,
	);
}
