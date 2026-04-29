import { Router } from "express";
import { authRouter } from "./auth";

export function adminRouter(app: Router) {
	const router = Router();
	app.use("/api/admin", router);
	router.get("/health", (_, res) => res.status(200).json("Admin healthy"));

	authRouter(router);


}
