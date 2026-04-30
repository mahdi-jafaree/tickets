import type { Request, Response } from "express";
import type { AccountService } from "../services/accountService";

export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	listAccounts = async (_req: Request, res: Response) => {
		const accounts = await this.accountService.listAll();
		res.status(200).json(accounts);
	};
}
