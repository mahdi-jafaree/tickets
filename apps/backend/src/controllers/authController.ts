import type { Request, Response } from "express";
import type { AuthService } from "../services/auth";

export class AuthController {
	constructor(private readonly authService: AuthService) {}

	getSession = async (req: Request, res: Response) => {
		res.status(200).json({ session: req.session });
	};

	login = async (req: Request, res: Response) => {
		const { emailAddress, password } = req.body;

		const result = await this.authService.login({
			emailAddress,
			password,
		});

		res.status(200).json(result);
	};

	register = async (req: Request, res: Response) => {
		const { firstName, lastName, emailAddress, password } = req.body;

		const result = await this.authService.register({
			firstName,
			lastName,
			emailAddress,
			password,
		});

		res.status(201).json(result);
	};
}
