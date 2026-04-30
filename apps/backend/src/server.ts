import express from "express";
import { randomUUID } from "node:crypto";
import pino from "pino";
import logger from "pino-http";
import "reflect-metadata";
import { createAppContainer } from "./container";
import { getDBSource } from "./db/dataSource";
import { errorHandler } from "./middleware/errorHandler";
import { adminRouter } from "./routes/";
import { seedTickets } from "./scripts/seed";

const app = express();

app.use(
	logger({
		logger: pino(),
		redact: ["req.body.password", "req.headers.authorization"],
		genReqId: (req, res) => {
			const existingID = req.id ?? req.headers["x-request-id"];
			if (existingID) return existingID;
			const id = randomUUID();
			res.setHeader("X-Request-Id", id);
			return id;
		},
		useLevel: "info",
	}),
);
app.get("/health", (_, res) => {
	res.status(200).json({ message: "OK" });
});

async function bootstrap() {
	try {
		const dataSource = await getDBSource();
		await dataSource.runMigrations();
		await seedTickets(dataSource.manager);
		const manager = dataSource.manager;

		createAppContainer(manager);

		app.use((req, _, next) => {
			req.manager = manager;
			next();
		});
		app.use(express.json());

		adminRouter(app);
		app.use(errorHandler);
		app.listen(4001, async () => {
			console.log("Server running on http://localhost:4001");
		});
	} catch (error) {
		console.log("Failed to start the server: ", error);
	}
}

bootstrap();
