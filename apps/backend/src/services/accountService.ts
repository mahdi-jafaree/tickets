import type { AccountRepository } from "../repositories/account.repository";
import type { SafeAccount } from "../types";
import TicketError, { BrotherErrorTypes } from "../utils/error";

export class AccountService {
	constructor(private readonly accountRepository: AccountRepository) {}

	async listAll(): Promise<SafeAccount[]> {
		const accounts = await this.accountRepository.find();
		return accounts.map((account) => ({
			id: account.id,
			firstName: account.firstName,
			lastName: account.lastName,
			emailAddress: account.emailAddress,
			roles: account.roles,
			createdAt: account.createdAt,
			updatedAt: account.updatedAt,
		}));
	}

	async retrieve(id: string): Promise<SafeAccount> {
		const account = await this.accountRepository.findOne({
			where: { id },
			relations: ["roles", "roles.role"],
		});

		if (!account) {
			throw new TicketError(
				BrotherErrorTypes.UNAUTHORIZED,
				"Invalid credentials",
				"unauthorized",
			);
		}

		return {
			id: account.id,
			firstName: account.firstName,
			lastName: account.lastName,
			emailAddress: account.emailAddress,
			roles: account.roles,
			createdAt: account.createdAt,
			updatedAt: account.updatedAt,
		};
	}
}
