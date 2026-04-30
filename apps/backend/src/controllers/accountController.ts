import type { Request, Response } from "express";
import type { AccountService } from "../services/accountService";

export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	listAccounts = async (_req: Request, res: Response) => {
		const accounts = await this.accountService.listAll();
		res.status(200).json(accounts);
	};

	createTechnician = async (req: Request, res: Response) => {
		const { firstName, lastName, emailAddress, password } = req.body;
		const account = await this.accountService.createTechnician({
			firstName,
			lastName,
			emailAddress,
			password,
		});
		res.status(201).json(account);
	};
}
