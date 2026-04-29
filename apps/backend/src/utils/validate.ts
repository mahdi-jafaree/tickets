import type { NextFunction, Request, Response } from "express";
import { ZodError, type z } from "zod";

export function validateData(Schema: z.ZodObject) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			Schema.parse(req.body);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errorMessages = error.issues.map((issue) => ({
					message: `${issue.path.join(".")} is ${issue.message}`,
				}));
				res
					.status(400)
					.json({ error: "Invalid data", message: errorMessages[0] });
			} else {
				res.status(500).json({ error: "Internal Server Error", message: "" });
			}
		}
	};
}
