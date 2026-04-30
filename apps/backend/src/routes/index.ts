import { Router } from "express";
import { accountRouter } from "./accounts";
import { authRouter } from "./auth";
import { ticketRouter } from "./ticket";

export function adminRouter(app: Router) {
	const router = Router();
	app.use("/api/admin", router);
	router.get("/health", (_, res) => res.status(200).json("Admin healthy"));

	authRouter(router);
	accountRouter(router);
	ticketRouter(router);
}
